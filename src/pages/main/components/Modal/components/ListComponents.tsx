import Exp1 from "./Exp1";
import Exp2 from "./Exp2";
import Exp3 from "./Exp3";
import Exp4 from "./Exp4";
import MeComponent from "./MeComponent";
import { ModelSkin } from "./ModelSkin";
import Proy1 from "./Proy1";
import Proy2 from "./Proy2";
import Proy3 from "./Proy3";


export const ListComponents: { [key: string]: React.ReactElement } = {
    "me1": <MeComponent/>,
    "exp1": <Exp1/>,
    "exp2": <Exp2/>,
    "exp3": <Exp3/>,
    "exp4": <Exp4/>,
    "proy1": <Proy1/>,
    "proy2": <Proy2/>,
    "proy3": <Proy3/>,
    "model1": <ModelSkin/>
}

