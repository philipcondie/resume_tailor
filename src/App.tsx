import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Home } from "./pages/Home";
import { Prompt } from "./pages/Prompt";
import { Preview } from "./pages/Preview";
import { Generate } from "./pages/Generate";
import { Resumes } from "./pages/Resumes";
import { Login } from "./pages/Login";
import { AuthProvider } from "./lib/auth";
import { PersonalInfoContainer } from "./pages/profile/PersonalInfoContainer";
import { JobEntryContainer } from "./pages/profile/JobEntryContainer";
import { EducationEntryContainer } from "./pages/profile/EducationEntryContainer";
import { ProjectEntryContainer } from "./pages/profile/ProjectEntryContainer";
import { SkillEntryContainer } from "./pages/profile/SkillEntryContainer";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { Signup } from "./pages/Signup";
import { LayoutConfigPage } from "./pages/LayoutConfigPage";

export default function App() {
    return (    
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route element={<ProtectedRoute />} >
                        <Route path="/app" element={<Home />}>
                            <Route index element={<Navigate to="resumes" replace />} />
                            <Route path="profile/personal" element={<PersonalInfoContainer />} />
                            <Route path="profile/work" element={<JobEntryContainer />} />
                            <Route path="profile/education" element={<EducationEntryContainer />} />
                            <Route path="profile/projects" element={<ProjectEntryContainer />} />
                            <Route path="profile/skills" element={<SkillEntryContainer />} />
                            <Route path="generate" element={<Generate />} />
                            <Route path="resumes" element={<Resumes />} />
                            <Route path="preview/:resumeId" element={<Preview />} />
                            <Route path="prompt" element={<Prompt />} />
                            <Route path="layout" element={<LayoutConfigPage />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
