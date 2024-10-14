import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@radix-ui/themes/styles.css"
import './index.css'
import { Theme } from '@radix-ui/themes'

import { RouterProvider } from 'react-router-dom'
import { router } from './routes.tsx'

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Theme accentColor='green' grayColor='gray' panelBackground='solid' appearance='light' radius='small'>
      <RouterProvider router={router}></RouterProvider>
    </Theme>
  </StrictMode>,
)
