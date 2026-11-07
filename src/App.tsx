import { BrowserRouter, Route, Routes } from "react-router"

import { SiteLayout } from "@/layouts/site-layout"
import { HomePage } from "@/pages/home-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { SectionPage } from "@/pages/section-page"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          {/* One route with an optional slug rather than a nested child, so
              SectionPage never unmounts when the detail pane opens or closes
              and the list keeps its scroll position. */}
          <Route path=":sectionId/:slug?" element={<SectionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
