import { usePersonalInfo } from "../../hooks/dataHooks";
import { PersonalInfoForm } from "../../components/InputForms/PersonalInfoForm";

export function PersonalInfoContainer() {
    const {personalInfo, updatePersonalInfo, clearPersonalInfo} = usePersonalInfo();
    return (
        <PersonalInfoForm info={personalInfo} handleUpdate={updatePersonalInfo} handleClear={clearPersonalInfo}/>
    )
}