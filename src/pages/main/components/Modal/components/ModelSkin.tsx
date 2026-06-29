import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as ort from 'onnxruntime-web';
import { Button, Typography } from 'antd';

// --- Interfaz para Detecciones Finales ---
interface FinalDetection {
  box: [number, number, number, number]; // x1, y1, x2, y2 (relativo a 512x512)
  score: number;
  classId: number;
  className: string;
}

// --- Constantes ---
const MODEL_INPUT_WIDTH = 512;
const MODEL_INPUT_HEIGHT = 512;
const MODEL_INPUT_CHANNELS = 3;

// !!! --- AJUSTE CRÍTICO AQUÍ --- !!!
// Basado en el error "11 atributos", tu modelo tiene 6 clases (4 box + 1 conf + 6 clases = 11)
const NUM_CLASSES = 7;

// !!! VERIFICA ESTA LISTA Y SU ORDEN !!!
// Debe contener EXACTAMENTE las 6 clases que tu modelo predice, en el orden correcto.
// Este es un EJEMPLO asumiendo que 'bkl' (Benign keratosis-like lesions) fue omitida.
// Si fue otra clase, ajusta la lista.
const CLASS_NAMES = [
  'akiec', // 0
  'bcc',   // 1
  'bkl',
  'df',    // 2 <- Nota: el índice cambia si falta 'bkl'
  'mel',   // 3
  'nv',    // 4
  'vasc'   // 5
];
const CLASS_NAMES_DESCRIPTION = {
  'akiec':'Queratosis actínica e intraepitelial carcinoma', // akiec
  'bcc':'Carcinoma basocelular',                          // bcc
  'bkl':'benign keratosis-like lesions',                 // bkl
  'df': 'Dermatofibroma',                                // df
  'mel': 'Melanoma',                                      // mel
  'nv': 'Nevus melanocítico',                            // nv
  'vasc': 'Lesiones vasculares'                            // vasc
}

// --- Fin del Ajuste Crítico ---

// --- Verificación de Configuración ---
if (CLASS_NAMES.length !== NUM_CLASSES) {
    throw new Error(`Error de Configuración: La longitud de CLASS_NAMES (${CLASS_NAMES.length}) no coincide con NUM_CLASSES (${NUM_CLASSES}).`);
}

// --- Umbrales ---
const CONFIDENCE_THRESHOLD = 0.35; // Ajusta según sea necesario
const IOU_THRESHOLD = 0.55;       // Ajusta según sea necesario

// Función Sigmoid para convertir logits a probabilidades
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// --- Funciones Auxiliares (Definidas Fuera del Componente) ---

function calculateIoU(box1: number[], box2: number[]): number {
  const [x1_1, y1_1, x2_1, y2_1] = box1;
  const [x1_2, y1_2, x2_2, y2_2] = box2;

  const x_left = Math.max(x1_1, x1_2);
  const y_top = Math.max(y1_1, y1_2);
  const x_right = Math.min(x2_1, x2_2);
  const y_bottom = Math.min(y2_1, y2_2);

  if (x_right < x_left || y_bottom < y_top) {
    return 0.0;
  }

  const intersection_area = (x_right - x_left) * (y_bottom - y_top);
  const box1_area = (x2_1 - x1_1) * (y2_1 - y1_1);
  const box2_area = (x2_2 - x1_2) * (y2_2 - y1_2);
  const union_area = box1_area + box2_area - intersection_area;

  return intersection_area / union_area;
}

function nonMaximumSuppression(
  detections: Omit<FinalDetection, 'className'>[],
  iouThreshold: number
): Omit<FinalDetection, 'className'>[] {
  if (!detections.length) {
    return [];
  }
  const sortedDetections = [...detections].sort((a, b) => b.score - a.score);
  const finalDetections: Omit<FinalDetection, 'className'>[] = [];

  while (sortedDetections.length > 0) {
    const bestDetection = sortedDetections.shift();
    if (!bestDetection) continue;
    finalDetections.push(bestDetection);

    const remainingIndicesToRemove: number[] = [];
    for (let i = 0; i < sortedDetections.length; i++) {
         const det = sortedDetections[i];
         if (det.classId === bestDetection.classId) {
            const iou = calculateIoU(bestDetection.box, det.box);
            if (iou >= iouThreshold) {
              remainingIndicesToRemove.push(i);
            }
         }
    }
    // Eliminar en orden inverso para no afectar índices restantes
    for (let i = remainingIndicesToRemove.length - 1; i >= 0; i--) {
        sortedDetections.splice(remainingIndicesToRemove[i], 1);
    }
  }
  return finalDetections;
}


// --- Componente React ---
export const ModelSkin: React.FC = () => {
  // --- Estados ---
  const [session, setSession] = useState<Awaited<ReturnType<typeof ort.InferenceSession.create>> | null>(null);
  const [, setOutput] = useState<Float32Array | null>(null); // Salida cruda (opcional)
  const [loading, setLoading] = useState({ session: true, inference: false });
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // DataURL de la imagen
  const [processedDetections, setProcessedDetections] = useState<FinalDetection[]>([]); // Detecciones finales
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // Canvas oculto para preprocesar
  const displayCanvasRef = useRef<HTMLCanvasElement>(null); // Canvas visible para dibujar

  // --- Callbacks y Efectos ---
  const stopCameraStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      console.log("Camera stream stopped.");
    }
  }, [stream]);

  // Efecto para Cargar Modelo y Cámaras
  useEffect(() => {
    let isMounted = true; // Flag para evitar setear estado si se desmonta
    setLoading({ session: true, inference: false });
    setError(null);

    const loadResources = async () => {
      try {
        // Cargar Modelo
        ort.env.wasm.wasmPaths = {
          'ort-wasm-simd-threaded.wasm': `/models/ort-wasm-simd-threaded.wasm`,
          'ort-wasm-simd-threaded.jsep.wasm': `/models/ort-wasm-simd-threaded.jsep.wasm`,
        };
        ort.env.wasm.simd = true;
        ort.env.wasm.numThreads = navigator.hardwareConcurrency || 1;
        const sess = await ort.InferenceSession.create(`/models/SkinModel.onnx`, { executionProviders: ['wasm'] });
        if (isMounted) {
            console.log('✅ Sesión WASM OK');
            console.log('Input names:', sess.inputNames);
            console.log('Output names:', sess.outputNames);
            setSession(sess);
        }

        // Cargar Cámaras
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
           if (isMounted) {
               console.log("Cámaras disponibles:", videoDevices);
               setAvailableCameras(videoDevices);
               if (videoDevices.length > 0 && !selectedDeviceId) {
                 setSelectedDeviceId(videoDevices[0].deviceId);
               }
           }
        } else {
             console.warn('enumerateDevices() no soportado.');
        }

      } catch (err: unknown) {
         if (isMounted) {
             console.error('Error cargando recursos:', err);
             setError(`Error cargando: ${err instanceof Error ? err.message : String(err)}`);
         }
      } finally {
         if (isMounted) {
            setLoading(prev => ({ ...prev, session: false }));
         }
      }
    };

    loadResources();

    // Cleanup
    return () => {
      isMounted = false;
      stopCameraStream();
    }
  }, [stopCameraStream, selectedDeviceId]); // selectedDeviceId no es estrictamente necesario aquí, pero no hace daño


  // Función para Abrir Cámara
  const handleOpenCamera = async () => {
    setError(null);
    setCapturedImage(null);
    setProcessedDetections([]); // Limpiar detecciones viejas
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('getUserMedia no es soportado.'); return;
    }
    if (availableCameras.length === 0) {
        setError('No se encontraron cámaras.'); return;
    }
    let deviceIdToUse = selectedDeviceId;
    if (!deviceIdToUse && availableCameras.length > 0) {
        console.warn("No hay cámara seleccionada, usando la primera.");
        deviceIdToUse = availableCameras[0].deviceId;
        setSelectedDeviceId(deviceIdToUse); // Actualizar estado si usamos la default
    }

    const constraints: MediaStreamConstraints = {
        video: deviceIdToUse ? { deviceId: { exact: deviceIdToUse } } : true
    };

    console.log("Intentando abrir cámara con constraints:", constraints);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Camera stream started.");
          // Opcional: Recargar lista de cámaras para obtener labels actualizados
          navigator.mediaDevices.enumerateDevices().then(devices => {
             const videoDevices = devices.filter(d => d.kind === 'videoinput');
             setAvailableCameras(videoDevices);
          });
        };
      }
    } catch (err: unknown) {
      console.error('Error accediendo a la cámara:', err);
      setError(`Error cámara: ${err instanceof Error ? err.message : String(err)}`);
      stopCameraStream();
    }
  };

  // Función para Preprocesar Imagen
  const preprocessImage = (ctx: CanvasRenderingContext2D, width: number, height: number): Float32Array => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const float32Data = new Float32Array(MODEL_INPUT_CHANNELS * height * width);
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4;
      const y = Math.floor(pixelIndex / width);
      const x = pixelIndex % width;
      // Normalizar a [0, 1] - Verifica si tu modelo necesita otra normalización
      const r = data[i] / 255.0;
      const g = data[i + 1] / 255.0;
      const b = data[i + 2] / 255.0;
      // Formato NCHW
      float32Data[0 * height * width + y * width + x] = r;
      float32Data[1 * height * width + y * width + x] = g;
      float32Data[2 * height * width + y * width + x] = b;
    }
    return float32Data;
  };

  // Función para Tomar Foto y Ejecutar Inferencia
  const handleTakePhotoAndInfer = async () => {
    if (!videoRef.current || !canvasRef.current || !stream || !session) {
      setError('Cámara no iniciada o modelo no cargado.'); return;
    }
    setLoading(prev => ({ ...prev, inference: true }));
    setError(null);
    setOutput(null);
    setProcessedDetections([]);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      setError('No se pudo obtener contexto del canvas.');
      setLoading(prev => ({ ...prev, inference: false })); return;
    }

    canvas.width = MODEL_INPUT_WIDTH;
    canvas.height = MODEL_INPUT_HEIGHT;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg'); // Guardar DataURL
    setCapturedImage(dataUrl); // Actualiza estado para disparar el dibujo

    try {
      const inputData = preprocessImage(ctx, canvas.width, canvas.height);
      await runInference(inputData); // runInference actualizará processedDetections
    } catch (err: unknown) {
      console.error("Error preprocesando o en inferencia:", err);
      setError(`Error procesando: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(prev => ({ ...prev, inference: false }));
    }
  };

    // --- Función para Ejecutar Inferencia y Post-procesamiento (CORREGIDA) ---
  const runInference = async (inputData: Float32Array) => {
    if (!session) { setError("Sesión ONNX no lista."); return; }
    console.log("Ejecutando inferencia...");
    setProcessedDetections([]); // Limpiar

    try {
      const inputName = session.inputNames[0];
      const outputName = session.outputNames[0];
      if (!inputName || !outputName) { setError("Nombres I/O no encontrados."); return; }

      const tensor = new ort.Tensor('float32', inputData, [1, MODEL_INPUT_CHANNELS, MODEL_INPUT_HEIGHT, MODEL_INPUT_WIDTH]);
      const feeds = { [inputName]: tensor };
      const results = await session.run(feeds);
      const outputTensor = results[outputName];

      if (!(outputTensor?.data instanceof Float32Array)) {
        setError("Salida inesperada del modelo."); setOutput(null); setProcessedDetections([]); return;
      }
      setOutput(outputTensor.data); // Guardar raw (opcional)

      // --- POST-PROCESAMIENTO con SIGMOID ---
      const outputData = outputTensor.data;
      const numProposals = outputTensor.dims[2];
      const numAttributes = outputTensor.dims[1]; // Debería ser 11

      if (numAttributes !== 4 + NUM_CLASSES) {
          const errorMsg = `Estructura de salida inesperada (${numAttributes} atributos). Se esperaban 5 + NUM_CLASSES (${NUM_CLASSES}) = ${5 + NUM_CLASSES}. Verifica NUM_CLASSES y CLASS_NAMES.`;
          console.error(errorMsg); setError(errorMsg); setProcessedDetections([]); return;
      }

      const detectionsRaw: Omit<FinalDetection, 'className'>[] = [];
      for (let i = 0; i < numProposals; i++) {
        const proposalIndex = i * numAttributes;

        // --- Aplicar Sigmoid a la Confianza ---
        const confidenceLogit = outputData[proposalIndex + 4];
        const confidenceProb = sigmoid(confidenceLogit); // <-- SIGMOID

        let bestClassId = -1;
        let bestClassProb = -1; // <-- Usaremos probabilidad

        // --- Aplicar Sigmoid a las Puntuaciones de Clase ---
        for (let j = 0; j < NUM_CLASSES; j++) {
          const classLogit = outputData[proposalIndex + 5 + j];
          const classProb = sigmoid(classLogit); // <-- SIGMOID
          if (classProb > bestClassProb) {
            bestClassProb = classProb;
            bestClassId = j;
          }
        }

        // Calcular puntuación final usando probabilidades
        const finalScore = confidenceProb * bestClassProb;

        // Filtrar usando la puntuación final (probabilidad combinada)
        if (finalScore >= CONFIDENCE_THRESHOLD && bestClassId !== -1) {
          // --- Coordenadas: AÚN PUEDEN ESTAR MAL ---
          // La decodificación asume que cx, cy, w, h están normalizados (0-1)
          // Si los valores crudos son enormes, esto seguirá dando resultados extraños.
          const cx = outputData[proposalIndex + 0];
          const cy = outputData[proposalIndex + 1];
          const w = outputData[proposalIndex + 2];
          const h = outputData[proposalIndex + 3];

          // Decodificar (esto puede necesitar ajuste si cx,cy,w,h no están en rango 0-1)
          const x1 = (cx - w / 2) * MODEL_INPUT_WIDTH;
          const y1 = (cy - h / 2) * MODEL_INPUT_HEIGHT;
          const x2 = (cx + w / 2) * MODEL_INPUT_WIDTH;
          const y2 = (cy + h / 2) * MODEL_INPUT_HEIGHT;

           // Añadir un chequeo básico de coordenadas (opcional pero útil)
           if (x1 < -MODEL_INPUT_WIDTH || y1 < -MODEL_INPUT_HEIGHT || x2 > 2*MODEL_INPUT_WIDTH || y2 > 2*MODEL_INPUT_HEIGHT || w <= 0 || h <= 0) {
               continue; // Omitir si las coordenadas son claramente inválidas
           }


          detectionsRaw.push({
            box: [Math.max(0, x1), Math.max(0, y1), Math.min(MODEL_INPUT_WIDTH, x2), Math.min(MODEL_INPUT_HEIGHT, y2)],
            score: finalScore, // ¡Usar la puntuación de probabilidad!
            classId: bestClassId,
          });
        }
      }
      console.log(`Detecciones filtradas (prob >= ${CONFIDENCE_THRESHOLD}): ${detectionsRaw.length}`);
      const nmsResults = nonMaximumSuppression(detectionsRaw, IOU_THRESHOLD);
      console.log(`Detecciones NMS: ${nmsResults.length}`);
      const finalDetectionsWithNames: FinalDetection[] = nmsResults.map(det => ({
         ...det,
         className: CLASS_NAMES[det.classId] ?? 'Desconocido'
      }));
      setProcessedDetections(finalDetectionsWithNames);

    } catch (err: unknown) {
      console.error('Error en inferencia/post-proc:', err);
      setError(`Error inferencia: ${err instanceof Error ? err.message : String(err)}`);
      setOutput(null);
      setProcessedDetections([]);
    }
  }; // Fin de runInference

  // Función para Dibujar Detecciones
  const drawDetections = useCallback(() => {
    const canvas = displayCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || !capturedImage) {
      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = canvas.width / canvas.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;
      if (imgAspectRatio > canvasAspectRatio) {
        drawHeight = canvas.width / imgAspectRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgAspectRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      }
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      const scaleX = drawWidth / MODEL_INPUT_WIDTH;
      const scaleY = drawHeight / MODEL_INPUT_HEIGHT;

      processedDetections.forEach(detection => {
        const [x1, y1, x2, y2] = detection.box;
        const score = detection.score;
        const className = detection.className;
        const drawX = x1 * scaleX + offsetX;
        const drawY = y1 * scaleY + offsetY;
        const drawW = (x2 - x1) * scaleX;
        const drawH = (y2 - y1) * scaleY;
        // Asignar un color por clase (ejemplo simple)
        const colorIndex = detection.classId % 6; // 0 a 5
        const colors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan'];
        ctx.strokeStyle = colors[colorIndex];
        ctx.lineWidth = 2;
        ctx.strokeRect(drawX, drawY, drawW, drawH);
        ctx.fillStyle = colors[colorIndex];
        ctx.font = '14px sans-serif';
        const label = `${className} (${(score * 100).toFixed(1)}%)`;
        const textX = drawX + 3;
        const textY = Math.max(15, drawY - 5);
        ctx.fillStyle = colors[colorIndex];
        ctx.fillText(label, textX, textY);
      });
    };
    img.onerror = () => { console.error("Error cargando imagen capturada."); if(ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height); }
    img.src = capturedImage;
  }, [capturedImage, processedDetections]);

  // Efecto para Disparar el Dibujo
  useEffect(() => {
    drawDetections();
  }, [drawDetections]); // drawDetections es estable por useCallback


  // --- Renderizado JSX ---
  return (
    <div>
      <h2>ONNX Inference | SKIN CANCER</h2>
      {loading.session && <p>Cargando modelo...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Controles */}
      {!loading.session && (
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {availableCameras.length > 0 && (
            <div>
              <label htmlFor="camera-select" style={{ marginRight: '5px' }}>Cámara:</label>
              <select
                id="camera-select"
                value={selectedDeviceId}
                onChange={(e) => { setSelectedDeviceId(e.target.value); if (stream) stopCameraStream(); }}
                disabled={loading.inference || !!stream}
              >
                {availableCameras.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Cámara ${device.deviceId.substring(0, 6)}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Button size='small' onClick={handleOpenCamera} disabled={loading.inference || availableCameras.length === 0 || !!stream}>
            {stream ? 'Cámara Abierta' : 'Abrir Cámara'}
          </Button>
          <Button size='small' onClick={handleTakePhotoAndInfer} disabled={!stream || loading.inference}>
            {loading.inference ? 'Procesando...' : 'Analizar Foto'}
          </Button>
          {stream && (
             <button onClick={stopCameraStream} disabled={loading.inference}>Cerrar Cámara</button>
          )}
        </div>
      )}

      {/* Visualización */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px' }}>
        {/* Cámara en Vivo */}
        <div>
          <h3>Cámara</h3>
          <video ref={videoRef} width={320} height={240} autoPlay playsInline muted style={{ border: '1px solid black', backgroundColor: '#eee' }}></video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> {/* Oculto */}
        </div>
        {/* Resultados */}
        {capturedImage && (
             <div>
                <h3>Detecciones</h3>
                <canvas ref={displayCanvasRef} width={480} height={360} style={{ border: '1px solid blue' }}></canvas>
                <p style={{marginTop: '5px'}}>{processedDetections.length} detección(es).</p>
            </div>
        )}
      </div>

       {/* Info de Depuración (Opcional) */}
       {!loading.inference && processedDetections.length > 0 && (
           <details style={{marginTop: '20px'}}>
               <summary>Ver Detecciones Procesadas (Texto)</summary>
               <pre style={{maxHeight: '150px', overflowY: 'auto', fontSize: '12px', backgroundColor: '#f0f0f0', padding: '5px', color: 'black'}}>
                   {processedDetections.map((d, i) =>
                       `[${i}] ${CLASS_NAMES_DESCRIPTION[d.className as keyof typeof CLASS_NAMES_DESCRIPTION] ?? 'Unknown'} (${(d.score * 100).toFixed(1)}%) @ [${d.box.map(b => b.toFixed(0)).join(', ')}]`
                   ).join('\n')}
               </pre>
           </details>
       )}
        <Typography.Title>Resultados Modelo | Dataset HAM10000 </Typography.Title>
        <Typography.Text>El modelo fue entrenado con Modelo Yolo12n con oversampling para la clase de df (dermatofibroma), con un total de 50 epocas, batch size 16.</Typography.Text>

       <div style={{padding: 5}}>
       <img src='/models/PR_curve.png' alt='Precision Recall' width="100%"/>

       </div>


    </div>
    
  );
};
