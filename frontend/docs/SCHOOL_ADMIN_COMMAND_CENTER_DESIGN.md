# School Admin Command Center - Design Documentation

## Overview

The School Admin Command Center is a premium UAE government-grade operational control center designed for school leadership. It provides operational clarity and fast decision-making capabilities with a calm, minimal, and trustworthy design language.

## Design Language

### Visual Identity
- **Backgrounds**: White & sand (`sand-50`, `sand-100`)
- **Accents**: Emerald/Teal (`emerald-500`, `teal-600`)
- **Cards**: Rounded corners (12-16px), soft shadows
- **Typography**: Cairo font family (Arabic-first)
- **Hierarchy**: Clear, uncluttered, authoritative

### Design Principles
1. **Calm UX**: No panic colors, no aggressive alerts
2. **Accessibility**: WCAG AA compliant
3. **Bilingual**: Arabic + English support (RTL/LTR ready)
4. **Responsive**: Mobile-first, tablet-friendly, desktop-optimized
5. **Privacy-First**: No unnecessary personal data shown
6. **Status Communication**: Color + Icon + Text (never color alone)

## Core Screens

### 1. Live Dashboard
**Purpose**: Real-time operational overview

**Components**:
- **KPI Tiles**: 6 key metrics with trend indicators
  - Active Incidents
  - Pending Approvals
  - SLA Compliance
  - Resolved Today
  - Average Response Time
  - Students on Campus
- **SLA Countdown Indicators**: Visual countdowns for time-sensitive items
- **Drill-down Filters**: Grade/Class filtering
- **Grade Breakdown Table**: Detailed view by grade level

**Features**:
- Trend arrows (up/down/neutral)
- Clickable KPI tiles for drill-down
- Real-time refresh capability
- Export-ready data tables

### 2. Incident Overview
**Purpose**: Comprehensive incident management

**Components**:
- **Search & Filters**: Status, severity, text search
- **Incident Cards**: Detailed incident information
  - Severity indicators (critical/high/medium/low)
  - Status badges (open/in-progress/resolved/closed)
  - Audit trail display
  - Locked state for closed incidents

**Features**:
- Color-coded severity (red/amber/blue/emerald)
- Status communication via icon + text + color
- Audit trail visibility
- Action buttons (view/edit) with role-based permissions
- Locked actions on closure

### 3. Approvals Queue
**Purpose**: Streamlined approval workflow

**Components**:
- **Summary Cards**: Pending/Approved/Rejected counts
- **SLA Countdown Section**: Urgent approvals (< 2 hours)
- **Approval Cards**: Detailed approval requests
  - Type indicators (dismissal/absence/activity/other)
  - Student information
  - Time remaining
  - Audit trail

**Features**:
- Priority-based highlighting
- SLA deadline tracking
- Role-based visibility
- Approve/Reject actions
- Locked state for closed approvals

### 4. Reports & Exports
**Purpose**: Data export and reporting

**Components**:
- **Summary Cards**: Key metrics overview
- **Report Generator**: Custom report creation
  - Report type selection
  - Date range picker
  - Export format (PDF/Excel/CSV/JSON)
- **Recent Reports**: List of generated reports
- **Export-Ready Table**: Preview of exportable data

**Features**:
- Multiple export formats
- Date range filtering
- Report type selection
- Download functionality
- Export-ready layouts

## Component Library

### KPITile
**Purpose**: Display key performance indicators

**Props**:
- `title`: Arabic title
- `titleEn`: English title
- `value`: Display value
- `trend`: 'up' | 'down' | 'neutral'
- `trendValue`: Trend change value
- `icon`: Lucide icon component
- `color`: 'emerald' | 'teal'
- `onClick`: Optional click handler

**Design**:
- White background card
- Colored icon badge
- Large value display
- Trend indicator with icon
- Bilingual labels

### SLACountdown
**Purpose**: Display SLA deadline countdown

**Props**:
- `title`: Item title
- `priority`: 'high' | 'medium' | 'low'
- `timeRemaining`: Minutes remaining
- `assignedTo`: Assigned person
- `status`: 'pending' | 'in-progress' | 'resolved'

**Design**:
- Priority-based color coding
- Progress bar visualization
- Time remaining display
- Urgent state highlighting (ring border)

### StatusIndicator
**Purpose**: Communicate status with color + icon + text

**Props**:
- `status`: 'safe' | 'warning' | 'info' | 'action' | 'error'
- `label`: Status text
- `showIcon`: Boolean
- `size`: 'sm' | 'md'

**Design**:
- Badge-style display
- Color-coded background
- Icon + text combination
- WCAG AA compliant contrast

## UX Patterns

### Navigation
- **Tab-based**: Clear section separation
- **Active State**: Teal underline + background
- **Badge Counts**: Notification counts on tabs
- **Refresh Button**: Manual data refresh

### Filtering
- **Collapsible Filters**: Grade/Class drill-down
- **Multi-select**: Status, severity, type filters
- **Search**: Real-time text search
- **Reset**: Clear all filters

### Data Display
- **Cards**: Rounded, shadowed containers
- **Tables**: Export-ready, sortable
- **Empty States**: Helpful messaging
- **Loading States**: Spinner animations

### Actions
- **Button Hierarchy**: Primary (teal), Secondary (white)
- **Disabled States**: Locked actions on closure
- **Role-based**: Conditional action visibility
- **Audit Trail**: Full action history

## States

### Empty State
- Icon + message
- Helpful guidance
- Neutral colors

### Loading State
- Spinner animation
- Teal accent color
- Centered display

### Error State
- Status indicator
- Error message
- Recovery options

### Locked State
- Lock icon
- Reduced opacity
- Disabled actions
- "Closed" label

## Accessibility

### WCAG AA Compliance
- **Color Contrast**: Minimum 4.5:1 for text
- **Status Communication**: Never color alone
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and roles
- **Focus Indicators**: Visible focus rings

### RTL/LTR Support
- `dir="rtl"` on main container
- Bilingual labels (Arabic + English)
- Proper text alignment
- Icon positioning

## Responsive Design

### Mobile (< 640px)
- Single column layouts
- Stacked filters
- Full-width cards
- Touch-friendly targets (44px minimum)

### Tablet (640px - 1024px)
- 2-column grids
- Side-by-side filters
- Medium-sized cards

### Desktop (> 1024px)
- 3-4 column grids
- Full feature set
- Optimized spacing
- Hover states

## Governance Features

### Audit Trails
- Full action history
- User attribution
- Timestamp display
- Chronological order

### Role-Based Visibility
- Permission-based filtering
- Conditional actions
- Data access control

### Locked Actions
- Closed items cannot be edited
- Visual lock indicator
- Disabled button states
- Clear messaging

## Color Palette

### Primary Colors
- **White**: `#FFFFFF` - Main backgrounds
- **Sand 50**: `#FAF9F6` - Secondary backgrounds
- **Sand 100**: `#F5F3ED` - Input backgrounds

### Accent Colors
- **Emerald 500**: `#059669` - Primary actions
- **Emerald 50**: `#D1FAE5` - Status backgrounds
- **Teal 600**: `#0F766E` - Secondary actions
- **Teal 50**: `#CCFBF1` - Info backgrounds

### Status Colors
- **Safe**: Emerald (green)
- **Warning**: Amber (yellow)
- **Info**: Blue
- **Action/Error**: Red

## Typography

### Font Family
- **Primary**: Cairo (Arabic)
- **Fallback**: Segoe UI, Tahoma, Arial

### Font Sizes
- **Heading 1**: 2xl-3xl (24-30px)
- **Heading 2**: xl-lg (20-24px)
- **Heading 3**: lg (18px)
- **Body**: sm-base (14-16px)
- **Small**: xs (12px)

### Font Weights
- **Bold**: 700 - Headings, important text
- **Medium**: 500 - Labels, buttons
- **Regular**: 400 - Body text

## Spacing

### Card Padding
- **Small**: 4 (16px)
- **Medium**: 6 (24px)
- **Large**: 8 (32px)

### Gaps
- **Small**: 2 (8px)
- **Medium**: 4 (16px)
- **Large**: 6 (24px)

### Border Radius
- **Card**: 12px
- **Card Large**: 16px
- **Badge**: 20px

## Shadows

### Shadow Types
- **Card**: `0 2px 8px rgba(0, 0, 0, 0.08)`
- **Elevated**: `0 4px 16px rgba(0, 0, 0, 0.12)`
- **Soft**: `0 1px 3px rgba(0, 0, 0, 0.06)`

## Microcopy

### Arabic Labels
- **لوحة التحكم المباشرة**: Live Dashboard
- **نظرة عامة على الحوادث**: Incident Overview
- **قائمة الموافقات**: Approvals Queue
- **التقارير والتصدير**: Reports & Exports

### Status Labels
- **مفتوح**: Open
- **قيد المعالجة**: In Progress
- **تم الحل**: Resolved
- **مغلق**: Closed

### Action Labels
- **عرض التفاصيل**: View Details
- **تعديل**: Edit
- **موافقة**: Approve
- **رفض**: Reject
- **تحميل**: Download

## Implementation Notes

### File Structure
```
frontend/src/
├── pages/admin/
│   └── SchoolAdminCommandCenter.tsx
└── components/admin/command-center/
    ├── LiveDashboard.tsx
    ├── IncidentOverview.tsx
    ├── ApprovalsQueue.tsx
    ├── ReportsExports.tsx
    ├── KPITile.tsx
    ├── SLACountdown.tsx
    ├── StatusIndicator.tsx
    └── index.ts
```

### Route
- **Path**: `/admin/command-center`
- **Roles**: `admin`, `super_admin`
- **Protected**: Yes

### API Integration
- Uses React Query for data fetching
- Mock data fallback for development
- Error handling with graceful degradation

## Future Enhancements

1. **Real-time Updates**: WebSocket integration
2. **Advanced Filtering**: Multi-select, saved filters
3. **Custom Dashboards**: User-configurable layouts
4. **Export Templates**: Customizable report formats
5. **Notifications**: Real-time alerts for SLA breaches
6. **Analytics**: Trend charts and predictions


