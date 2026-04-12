import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Prompt } from "./pages/Prompt";
import { Preview } from "./pages/Preview";
import { Generate } from "./pages/Generate";
import { Resumes } from "./pages/Resumes";
import { PersonalInfoContainer } from "./pages/profile/PersonalInfoContainer";
import { JobEntryContainer } from "./pages/profile/JobEntryContainer";
import { EducationEntryContainer } from "./pages/profile/EducationEntryContainer";
import { ProjectEntryContainer } from "./pages/profile/ProjectEntryContainer";
import { SkillEntryContainer } from "./pages/profile/SkillEntryContainer";
import { PasswordGate } from "./components/PasswordGate";
import { Data } from "./pages/Data";

export default function App() {
    return (
        <PasswordGate>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route index element={<Navigate to="profile/personal" replace />} />
                    <Route path="profile/data" element={<Data />} />
                    <Route path="profile/personal" element={<PersonalInfoContainer />} />
                    <Route path="profile/work" element={<JobEntryContainer />} />
                    <Route path="profile/education" element={<EducationEntryContainer />} />
                    <Route path="profile/projects" element={<ProjectEntryContainer />} />
                    <Route path="profile/skills" element={<SkillEntryContainer />} />
                    <Route path="/generate" element={<Generate />} />
                    <Route path="/resumes" element={<Resumes />} />
                    <Route path="/preview/:resumeId" element={<Preview />} />
                    <Route path="/prompt" element={<Prompt />} />
                </Route>
            </Routes>
        </BrowserRouter>
        </PasswordGate>
    )
}
