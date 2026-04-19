import { useState, useEffect } from 'react';
import { Spinner } from '../../components/utils/Spinner';
import { PersonalInfoEntry } from "../../types/resume";
import { PersonalInfoForm } from "../../components/InputForms/PersonalInfoForm";
import { ApiError, personalInfoApi } from '../../lib/api';

const defaultPersonalInfo = {
    'name': '',
    'email': '',
    'phonenumber': '',
    'extras': []
};

export function PersonalInfoContainer() {
    const [personalInfo, setPersonalInfo] = useState<PersonalInfoEntry>(defaultPersonalInfo);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        personalInfoApi.get()
            .then(data => setPersonalInfo(data))
            .catch((error) => {
                if (error instanceof ApiError && error.status == 404) {
                    setPersonalInfo(defaultPersonalInfo);
                } else {
                    setError(error);
                }
            })
            .finally(() => setIsLoading(false))
    }, []);

    if (isLoading) return <Spinner />
    if (error) return (
        <div>
            {error.message}
        </div>
    )
    return (
        <PersonalInfoForm 
            info={personalInfo} 
            handleUpdate={(info) => {personalInfoApi.save(info); setPersonalInfo(info)}} 
            handleClear={() => {personalInfoApi.save(defaultPersonalInfo); setPersonalInfo(defaultPersonalInfo)}}
        />
    )
}