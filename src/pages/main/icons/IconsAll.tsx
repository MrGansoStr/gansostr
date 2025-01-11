import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import PythonLogo from "./logo-python.svg?react"; 
import ReactIcon  from "./logo-react.svg?react"
import FlaskIcon from "./logo-flask.svg?react"
import PytorchIcon from "./logo-pytorch.svg?react"
import TornadoIcon from "./logo-tornado.svg?react"
import CupyIcon from "./logo-cupy.svg?react"
import OpenCVIcon from "./logo-opencv.svg?react"
import NumpyIcon from "./logo-numpy.svg?react"
import RedisIcon from "./logo-redis.svg?react"
import MysqlIcon from "./logo-mysql.svg?react"
import MongoIcon from "./logo-mongo.svg?react"
import ScikitlearnIcon from "./logo-scikitlearn.svg?react"
import TypescriptIcon from "./logo-typescript.svg?react"
import GithubIcon from "./logo-github.svg?react"
import PostgreSql from "./logo-postgresql.svg?react"
import NodeJSIcon from "./logo-nodejs.svg?react"
import MaterialUIICON from "./logo-materialui.svg?react"


// COMPONENTES WITH PROPS
export const FlaskIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <FlaskIcon {...props} style={{ width: '3em', height:"1.3em",...props.style }} />
);

export const PytorchIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <PytorchIcon {...props} style={{ width: '3em', height:"1.3em", filter: "invert(0.8)", ...props.style}} />
);

export const CupyIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <CupyIcon {...props} style={{ width: '1.5em', height:"1.3em", filter: "invert(0.5)", ...props.style}} />
);

export const OpenCVIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <OpenCVIcon {...props} style={{ width: '1.5em', height:"1.3em", filter: "invert(0.5)", ...props.style}} />
);

export const NumpyIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <NumpyIcon {...props} style={{ width: '1.5em', height:"1.3em", filter: "invert(0.5)", ...props.style}} />
)

export const RedisIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <RedisIcon {...props} style={{ width: '1.5em', height:"1.3em", filter: "invert(0.5)", ...props.style}} />
)

export const MysqlIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <MysqlIcon {...props} style={{ width: '1.5em', height:"1.3em", filter: "invert(0.5)", ...props.style}} />
)
export const MongoIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <MongoIcon {...props} style={{ width: '1.5em', height:"1.3em", filter: "invert(0.5)", ...props.style}} />
)

export const ScikitlearnIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <ScikitlearnIcon {...props} style={{ width: '1.5em', height:"1.3em", filter: "invert(0.5)", ...props.style}} />
)

export const TypescriptIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <TypescriptIcon {...props} style={{ width: '1.5em', height:"1.3em", filter: "", ...props.style}} />
)

export const PostgreSqlIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <PostgreSql {...props} style={{ width: '1.5em', height:"1.3em", filter: "", ...props.style}} />
)

export const MaterialUIIconWithProps = (props: React.SVGProps<SVGSVGElement>) => (
    <MaterialUIICON {...props} style={{ width: '1.5em', height:"1.3em", filter: "", ...props.style}} />
)


// ###########################################################################

export const CustomMaterialUIIcon= (props: Partial<CustomIconComponentProps>) => (
    <Icon component={MaterialUIIconWithProps} {...props} />
);

export const CustomPostgreSqlIcon= (props: Partial<CustomIconComponentProps>) => (
    <Icon component={PostgreSqlIconWithProps} {...props} />
);

export const CustomTypescriptIcon= (props: Partial<CustomIconComponentProps>) => (
    <Icon component={TypescriptIconWithProps} {...props} />
);

export const CustomScikitlearnIcon= (props: Partial<CustomIconComponentProps>) => (
    <Icon component={ScikitlearnIconWithProps} {...props} />
);

export const CustomMongoIcon= (props: Partial<CustomIconComponentProps>) => (
    <Icon component={MongoIconWithProps} {...props} />
);

export const CustomMysqlIcon= (props: Partial<CustomIconComponentProps>) => (
    <Icon component={MysqlIconWithProps} {...props} />
);

export const CustomRedisIcon= (props: Partial<CustomIconComponentProps>) => (
    <Icon component={RedisIconWithProps} {...props} />
);

export const CustomNumpyIcon= (props: Partial<CustomIconComponentProps>) => (
    <Icon component={NumpyIconWithProps} {...props} />
);

export const CustomOpenCVIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={OpenCVIconWithProps} {...props} />
);


export const CustomCupyIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={CupyIconWithProps} {...props} />
);

export const CustomTornadoIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={(svgProps:any) => <TornadoIcon {...svgProps} />} {...props} />
);

export const CustomPytorchIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={PytorchIconWithProps} {...props} />
)

export const CustomFlaskIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={FlaskIconWithProps} {...props} />
);

export const CustomReactIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={(svgProps:any) => <ReactIcon {...svgProps} />} {...props} />
);

export const CustomPythonIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={(svgProps:any) => <PythonLogo {...svgProps} />} {...props} />
);

export const CustomGithubIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={(svgProps:any) => <GithubIcon {...svgProps} />} {...props} />
);
export const CustomNodeJSIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={(svgProps:any) => <NodeJSIcon {...svgProps} />} {...props} />
);