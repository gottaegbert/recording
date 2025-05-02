# ?3 Collection

Fork From [shadcn/ui sidebar](https://shadcn-ui-sidebar.salimi.my)

Here are my collections and practice of shaders/3d/motion/UI/datavis

## >

## Features

- Retractable mini and wide sidebar
- Scrollable sidebar menu
- Sheet menu for mobile
- Grouped menu with labels
- Collapsible submenu
- Extracted menu items list

## Tech/framework used

- Next.js 15
- Shadcn/ui
- Tailwind CSS
- TypeScript
- Zustand

## Installation

### Usage example for Nextjs

```tsx
//layout.tsx
import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}

//page.tsx
import { ContentLayout } from '@/components/admin-panel/content-layout';

export default function Page() {
  return (
    <ContentLayout title="Test">
      <div>Test</div>
    </ContentLayout>
  );
}
