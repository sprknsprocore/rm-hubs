import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LayoutGroup } from 'framer-motion'
import AppLayout from './components/chrome/AppLayout'
import TrueUpLayout from './components/chrome/TrueUpLayout'
import EquipmentLogLayout from './components/chrome/EquipmentLogLayout'
import ProjectHubLayout from './components/chrome/ProjectHubLayout'
import HubsSandboxLayout from './components/sandbox/HubsSandboxLayout'

function App() {
  return (
    <BrowserRouter>
      <LayoutGroup>
        <Routes>
          <Route path="/hubs-sandbox" element={<HubsSandboxLayout />} />
          <Route path="/workflow/true-up" element={<TrueUpLayout />} />
          <Route path="/workflow/off-rent-idle" element={<EquipmentLogLayout />} />
          <Route path="/project/:projectId" element={<ProjectHubLayout />} />
          <Route path="*" element={<AppLayout />} />
        </Routes>
      </LayoutGroup>
    </BrowserRouter>
  )
}

export default App
