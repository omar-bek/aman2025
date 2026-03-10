# Government / Authority Dashboard - Design Documentation

## Overview

The Government/Authority Dashboard is a premium UAE government-grade national visibility platform designed for education authorities at the federal and emirate levels. It provides comprehensive national insights without privacy invasion, enabling data-driven policy decisions with a calm, minimal, and trustworthy design language.

**Primary Goal**: National visibility without privacy invasion.

## Design Language

### Visual Identity
- **Backgrounds**: White & sand (`sand-50`, `sand-100`)
- **Accents**: Emerald/Teal (`emerald-500`, `teal-600`) - used sparingly for analytical emphasis
- **Cards**: Rounded corners (12-16px), soft shadows
- **Typography**: Cairo font family (Arabic-first)
- **Hierarchy**: Clear, uncluttered, policy-grade, analytical
- **Tone**: Neutral, authoritative, data-driven

### Design Principles
1. **Calm UX**: No panic colors, no aggressive alerts
2. **Accessibility**: WCAG AA compliant
3. **Bilingual**: Arabic + English support (RTL/LTR ready)
4. **Responsive**: Mobile-first, tablet-friendly, desktop-optimized
5. **Privacy-First**: Aggregated data only, no student-level identifiers
6. **Status Communication**: Color + Icon + Text (never color alone)
7. **Sovereign-Grade**: Professional, trustworthy, culturally respectful

## Core Screens

### 1. National Overview
**Purpose**: High-level national education metrics and KPIs

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: National Education Dashboard                   │
│  [Region Filter] [School Type Filter] [Date Range]      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Total    │ │ Active   │ │ Avg      │ │ System   │ │
│  │ Schools  │ │ Students │ │ Attendance│ │ Health   │ │
│  │ 1,247    │ │ 485,230  │ │ 94.2%    │ │ Healthy  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Safety   │ │ Compliance│ │ Parent   │ │ Teacher  │ │
│  │ Score    │ │ Rate     │ │ Engagement│ │ Retention│ │
│  │ 96.8%    │ │ 98.5%    │ │ 87.3%    │ │ 92.1%    │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
├─────────────────────────────────────────────────────────┤
│  Regional Distribution (Map/Chart)                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │ [Interactive UAE Map with Regional Metrics]       │ │
│  │ Dubai: 342 schools | Abu Dhabi: 298 schools      │ │
│  │ Sharjah: 187 schools | ...                       │ │
│  └───────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  School Type Distribution                               │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Public: 65% | Private: 28% | Charter: 7%        │ │
│  │ [Horizontal Bar Chart]                           │ │
│  └───────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Recent Trends (Last 30 Days)                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │ [Line Chart: Attendance, Safety, Compliance]      │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Components**:
- **National KPI Cards**: 8 key metrics
  - Total Schools (with trend)
  - Active Students (with trend)
  - Average Attendance Rate (with trend)
  - System Health Status
  - Safety Score (aggregated)
  - Compliance Rate (with trend)
  - Parent Engagement Rate (aggregated)
  - Teacher Retention Rate (aggregated)
- **Regional Distribution Map**: Interactive UAE map showing regional metrics
- **School Type Distribution**: Visual breakdown by school type
- **Trend Charts**: 30-day trend visualization
- **Filter Bar**: Region, School Type, Date Range

**Features**:
- Real-time aggregated metrics
- Trend indicators (up/down/neutral) with percentage change
- Clickable KPI cards for drill-down
- Export-ready data
- No individual student or teacher identifiers

**Microcopy**:
- **Arabic**: "لوحة التحكم الوطنية" (National Dashboard)
- **English**: "National Overview"
- **KPI Labels**: 
  - Arabic: "إجمالي المدارس" | English: "Total Schools"
  - Arabic: "الطلاب النشطون" | English: "Active Students"
  - Arabic: "متوسط الحضور" | English: "Average Attendance"
  - Arabic: "صحة النظام" | English: "System Health"
  - Arabic: "مؤشر السلامة" | English: "Safety Score"
  - Arabic: "معدل الامتثال" | English: "Compliance Rate"
  - Arabic: "مشاركة أولياء الأمور" | English: "Parent Engagement"
  - Arabic: "استبقاء المعلمين" | English: "Teacher Retention"

---

### 2. Heatmaps
**Purpose**: Geographic and temporal visualization of aggregated metrics

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: National Heatmaps                               │
│  [Metric Selector] [Time Period] [Region Filter]         │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐ │
│  │ Geographic Heatmap (UAE Map)                       │ │
│  │                                                     │ │
│  │  [Interactive Map with Color-Coded Regions]        │ │
│  │  Legend: [High] [Medium] [Low]                     │ │
│  │                                                     │ │
│  └───────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐ │
│  │ Temporal Heatmap (Calendar View)                   │ │
│  │                                                     │ │
│  │  [Calendar Grid with Color Intensity]             │ │
│  │  Shows patterns over time (last 90 days)          │ │
│  │                                                     │ │
│  └───────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐ │
│  │ School Type Heatmap (Matrix)                       │ │
│  │                                                     │ │
│  │  [Matrix: Region × School Type]                    │ │
│  │  Color intensity = metric value                    │ │
│  │                                                     │ │
│  └───────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Selected Region Details                                │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Region: Dubai                                      │ │
│  │ Schools: 342 | Students: 142,350                  │ │
│  │ Attendance: 95.2% | Safety: 97.1%                  │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Components**:
- **Geographic Heatmap**: Interactive UAE map
  - Color-coded regions (emerald gradient: light to dark)
  - Hover tooltips with aggregated metrics
  - Click to drill down to region details
- **Temporal Heatmap**: Calendar grid view
  - Shows metric intensity over time (last 90 days)
  - Color intensity indicates value
  - Hover for specific date metrics
- **School Type Matrix**: Cross-tabulation heatmap
  - Rows: Regions (Dubai, Abu Dhabi, Sharjah, etc.)
  - Columns: School Types (Public, Private, Charter)
  - Cell color intensity = aggregated metric value
- **Metric Selector**: Dropdown to switch metrics
  - Attendance Rate
  - Safety Score
  - Compliance Rate
  - Incident Frequency (aggregated)
  - Parent Engagement
- **Region Detail Panel**: Side panel showing selected region metrics

**Features**:
- Interactive map with zoom/pan
- Color legend with value ranges
- Tooltip on hover (shows aggregated data only)
- Export map as image (PNG/SVG)
- Time period selector (7/30/90 days, custom range)
- No individual school or student identification

**Microcopy**:
- **Arabic**: "خرائط الحرارة الوطنية" (National Heatmaps)
- **English**: "Heatmaps"
- **Metric Labels**:
  - Arabic: "معدل الحضور" | English: "Attendance Rate"
  - Arabic: "مؤشر السلامة" | English: "Safety Score"
  - Arabic: "معدل الامتثال" | English: "Compliance Rate"
  - Arabic: "تكرار الحوادث" | English: "Incident Frequency"
  - Arabic: "مشاركة أولياء الأمور" | English: "Parent Engagement"
- **Tooltip**: 
  - Arabic: "المنطقة: {region} | المدارس: {count} | الطلاب: {count}"
  - English: "Region: {region} | Schools: {count} | Students: {count}"

---

### 3. Trend Analysis
**Purpose**: Deep-dive analytical view of national trends and patterns

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Trend Analysis                                  │
│  [Metric Group] [Comparison Mode] [Export]               │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐ │
│  │ Primary Trend Chart                                │ │
│  │                                                     │ │
│  │  [Multi-line Chart: Last 12 Months]               │ │
│  │  Lines: Attendance, Safety, Compliance              │ │
│  │  Y-axis: Percentage | X-axis: Months               │ │
│  │                                                     │ │
│  └───────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Regional     │ │ School Type  │ │ Seasonal     │   │
│  │ Comparison   │ │ Comparison   │ │ Patterns     │   │
│  │              │ │              │ │              │   │
│  │ [Bar Chart]  │ │ [Bar Chart]  │ │ [Line Chart] │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────┤
│  Statistical Insights                                   │
│  ┌───────────────────────────────────────────────────┐ │
│  │ • Attendance increased 2.3% YoY                   │ │
│  │ • Safety scores stable across all regions         │ │
│  │ • Compliance rate highest in Abu Dhabi (99.1%)    │ │
│  │ • Private schools show 5.2% higher engagement    │ │
│  └───────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Forecast (Next 3 Months)                              │
│  ┌───────────────────────────────────────────────────┐ │
│  │ [Projected Trend Line with Confidence Interval]   │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Components**:
- **Primary Trend Chart**: Multi-line time series
  - Configurable metrics (Attendance, Safety, Compliance, etc.)
  - Time range: 3/6/12 months, custom
  - Interactive: hover for values, click to filter
  - Export as image
- **Regional Comparison Chart**: Grouped bar chart
  - Compare metrics across regions
  - Stacked or grouped view toggle
- **School Type Comparison Chart**: Grouped bar chart
  - Compare metrics by school type
  - Public vs Private vs Charter
- **Seasonal Patterns Chart**: Line chart
  - Shows cyclical patterns (monthly, quarterly)
  - Helps identify seasonal trends
- **Statistical Insights Panel**: Auto-generated insights
  - Year-over-year changes
  - Regional comparisons
  - Anomaly detection
  - Significant patterns
- **Forecast Panel**: Predictive analytics
  - 3-month projection with confidence intervals
  - Based on historical trends
  - Clearly labeled as "Projected"

**Features**:
- Interactive charts with zoom/pan
- Metric selector (single or multiple)
- Comparison mode (YoY, MoM, regional, type)
- Export charts (PNG/SVG/PDF)
- Statistical summary cards
- Forecast toggle (show/hide projections)
- No individual data points shown

**Microcopy**:
- **Arabic**: "تحليل الاتجاهات" (Trend Analysis)
- **English**: "Trend Analysis"
- **Chart Labels**:
  - Arabic: "الاتجاه الشهري" | English: "Monthly Trend"
  - Arabic: "المقارنة الإقليمية" | English: "Regional Comparison"
  - Arabic: "أنماط موسمية" | English: "Seasonal Patterns"
- **Insights**:
  - Arabic: "زيادة {value}% على أساس سنوي" | English: "{value}% increase YoY"
  - Arabic: "مستقر عبر جميع المناطق" | English: "Stable across all regions"
- **Forecast**:
  - Arabic: "التنبؤ (الشهور الثلاثة القادمة)" | English: "Forecast (Next 3 Months)"
  - Arabic: "مشروع - غير مؤكد" | English: "Projected - Uncertain"

---

### 4. Policy Reports
**Purpose**: Comprehensive policy-grade reports for decision-making

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Policy Reports                                  │
│  [Report Type] [Generate New] [Saved Reports]            │
├─────────────────────────────────────────────────────────┤
│  Report Templates                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Monthly      │ │ Quarterly     │ │ Annual       │   │
│  │ Summary      │ │ Compliance    │ │ Education    │   │
│  │              │ │ Report        │ │ Report       │   │
│  │ [Preview]    │ │ [Preview]     │ │ [Preview]    │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Safety        │ │ Regional      │ │ Custom       │   │
│  │ Assessment    │ │ Performance   │ │ Report       │   │
│  │              │ │ Report        │ │ Builder      │   │
│  │ [Preview]     │ │ [Preview]     │ │ [Create]     │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────┤
│  Recent Reports                                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 📄 Monthly Summary - December 2024                │ │
│  │    Generated: Dec 31, 2024 | PDF, Excel           │ │
│  │    [View] [Download] [Share]                       │ │
│  ├───────────────────────────────────────────────────┤ │
│  │ 📄 Quarterly Compliance - Q4 2024                 │ │
│  │    Generated: Dec 15, 2024 | PDF, Excel           │ │
│  │    [View] [Download] [Share]                       │ │
│  └───────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Report Builder (When Creating Custom Report)          │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Report Name: [________________]                    │ │
│  │ Date Range: [Start] to [End]                      │ │
│  │ Regions: [☑ Dubai] [☑ Abu Dhabi] [☐ All]         │ │
│  │ School Types: [☑ Public] [☑ Private] [☐ All]     │ │
│  │ Metrics: [☑ Attendance] [☑ Safety] [☑ Compliance]  │ │
│  │ Format: [PDF] [Excel] [CSV] [JSON]                │ │
│  │ [Generate Report]                                  │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Components**:
- **Report Template Cards**: Pre-configured report types
  - Monthly Summary Report
  - Quarterly Compliance Report
  - Annual Education Report
  - Safety Assessment Report
  - Regional Performance Report
  - Custom Report Builder
- **Report Preview**: Modal/drawer showing report preview
  - Table of contents
  - Sample pages
  - Data summary
- **Recent Reports List**: Chronological list
  - Report name, date generated, formats available
  - Actions: View, Download, Share
  - Status: Generating, Ready, Failed
- **Report Builder**: Form for custom reports
  - Report name
  - Date range picker
  - Region multi-select
  - School type multi-select
  - Metric selection (checkboxes)
  - Format selection (PDF/Excel/CSV/JSON)
  - Generate button
- **Report Viewer**: Full-screen report view
  - PDF viewer or formatted HTML
  - Download button
  - Print button
  - Share button (with permissions)

**Features**:
- Pre-built report templates
- Custom report builder
- Multiple export formats
- Scheduled reports (future enhancement)
- Report sharing with role-based permissions
- Watermarking for official reports
- All data aggregated (no PII)

**Microcopy**:
- **Arabic**: "تقارير السياسات" (Policy Reports)
- **English**: "Policy Reports"
- **Report Types**:
  - Arabic: "التقرير الشهري" | English: "Monthly Summary"
  - Arabic: "تقرير الامتثال الربعي" | English: "Quarterly Compliance"
  - Arabic: "التقرير السنوي للتعليم" | English: "Annual Education Report"
  - Arabic: "تقييم السلامة" | English: "Safety Assessment"
  - Arabic: "تقرير الأداء الإقليمي" | English: "Regional Performance"
  - Arabic: "تقرير مخصص" | English: "Custom Report"
- **Actions**:
  - Arabic: "عرض" | English: "View"
  - Arabic: "تحميل" | English: "Download"
  - Arabic: "مشاركة" | English: "Share"
  - Arabic: "إنشاء تقرير" | English: "Generate Report"

---

## Component Library

### NationalKPICard
**Purpose**: Display national-level key performance indicators

**Props**:
- `title`: Arabic title
- `titleEn`: English title
- `value`: Display value (number or percentage)
- `trend`: 'up' | 'down' | 'neutral'
- `trendValue`: Trend change value (percentage)
- `icon`: Lucide icon component
- `color`: 'emerald' | 'teal' | 'neutral'
- `onClick`: Optional click handler for drill-down
- `subtitle`: Optional subtitle (e.g., "Last 30 days")

**Design**:
- White background card with rounded corners (16px)
- Soft shadow (0 2px 8px rgba(0, 0, 0, 0.08))
- Large value display (2xl-3xl font size)
- Trend indicator with icon (up/down/neutral arrow)
- Bilingual labels (Arabic primary, English secondary)
- Hover state: subtle elevation
- Clickable if drill-down available

**States**:
- **Default**: White background, normal shadow
- **Hover**: Elevated shadow, cursor pointer
- **Loading**: Skeleton loader
- **Error**: Subtle error indicator (icon + text)

---

### HeatmapMap
**Purpose**: Interactive geographic heatmap visualization

**Props**:
- `data`: Aggregated data by region
- `metric`: Selected metric key
- `colorScale`: Color gradient function
- `onRegionClick`: Click handler for region selection
- `tooltipFormatter`: Custom tooltip formatter

**Design**:
- SVG-based UAE map
- Color-coded regions (emerald gradient)
- Hover tooltip with aggregated metrics
- Click to select region
- Legend showing value ranges
- Zoom/pan controls (desktop)

**States**:
- **Default**: Map rendered with color coding
- **Hover**: Region highlighted, tooltip shown
- **Selected**: Region outlined with accent color
- **Loading**: Skeleton map with shimmer
- **Error**: Error message with retry button

---

### TrendChart
**Purpose**: Multi-metric time series visualization

**Props**:
- `data`: Time series data array
- `metrics`: Array of metric keys to display
- `timeRange`: Time range (3/6/12 months, custom)
- `comparisonMode`: 'none' | 'yoy' | 'mom' | 'regional'
- `onMetricToggle`: Handler for metric selection
- `exportFormats`: Array of export formats

**Design**:
- Line chart (multi-line support)
- X-axis: Time (months/days)
- Y-axis: Metric value (percentage/number)
- Color-coded lines per metric
- Interactive: hover for values, click to filter
- Legend with metric names
- Export button (top right)

**States**:
- **Default**: Chart rendered with data
- **Loading**: Skeleton chart with shimmer
- **Empty**: Empty state with message
- **Error**: Error message with retry

---

### ReportCard
**Purpose**: Display report template or generated report

**Props**:
- `title`: Report title
- `titleEn`: English title
- `description`: Report description
- `type`: Report type (template/generated)
- `status`: 'ready' | 'generating' | 'failed'
- `formats`: Available formats array
- `generatedAt`: Timestamp (for generated reports)
- `onView`: View handler
- `onDownload`: Download handler
- `onShare`: Share handler

**Design**:
- White card with rounded corners (16px)
- Icon representing report type
- Title and description
- Status badge (if generating/failed)
- Action buttons (View, Download, Share)
- Preview thumbnail (for generated reports)

**States**:
- **Template**: Show preview button
- **Ready**: Show view/download/share buttons
- **Generating**: Show progress indicator
- **Failed**: Show error message with retry

---

### FilterBar
**Purpose**: Unified filtering interface for all screens

**Props**:
- `regions`: Available regions array
- `schoolTypes`: Available school types array
- `dateRange`: Date range picker state
- `onRegionChange`: Region filter handler
- `onSchoolTypeChange`: School type filter handler
- `onDateRangeChange`: Date range handler
- `onReset`: Reset all filters handler

**Design**:
- Horizontal bar with filter controls
- Multi-select dropdowns for regions and school types
- Date range picker
- Reset button (when filters active)
- Active filter badges
- Responsive: stacks on mobile

**States**:
- **Default**: All filters showing available options
- **Active**: Filters applied, badges shown
- **Loading**: Disabled state with spinner

---

### StatisticalInsightCard
**Purpose**: Display auto-generated statistical insights

**Props**:
- `insight`: Insight text
- `insightEn`: English insight text
- `type`: 'positive' | 'neutral' | 'attention'
- `icon`: Icon component
- `supportingData`: Optional supporting data object

**Design**:
- Subtle background (sand-50 or emerald-50)
- Icon + text layout
- Bilingual text
- Supporting data shown below (if available)
- Neutral colors (no alarm colors)

**States**:
- **Default**: Normal display
- **Expandable**: Click to show more details

---

## UX Patterns

### Navigation
- **Top Navigation**: Persistent header with screen tabs
  - National Overview
  - Heatmaps
  - Trend Analysis
  - Policy Reports
- **Active State**: Teal underline + subtle background
- **Breadcrumbs**: For drill-down navigation
- **Back Button**: Return to parent view

### Filtering
- **Persistent Filters**: Filters persist across screens
- **Filter Bar**: Always visible at top
- **Multi-select**: Regions and school types
- **Date Range**: Calendar picker with presets
- **Reset**: Clear all filters button
- **Filter Badges**: Show active filters
- **Save Filters**: Save filter presets (future)

### Data Display
- **Cards**: Rounded (16px), soft shadows
- **Charts**: Interactive, exportable
- **Tables**: Sortable, exportable, paginated
- **Empty States**: Helpful messaging with icon
- **Loading States**: Skeleton loaders
- **Error States**: Clear error messages with recovery

### Actions
- **Primary Actions**: Teal/emerald buttons
- **Secondary Actions**: White buttons with border
- **Export Actions**: Download icon + format selector
- **Share Actions**: Share dialog with permissions
- **Drill-down**: Click cards/charts to drill down

### Privacy Indicators
- **Aggregation Badge**: "Aggregated Data" badge on all views
- **No PII Warning**: Subtle reminder that no individual data is shown
- **Data Masking**: Ensure no accidental PII exposure

## States

### Empty State
**Design**:
- Large icon (neutral color)
- Heading: "No data available"
- Subheading: Context-specific message
- Action: "Refresh" or "Adjust filters"

**Microcopy**:
- Arabic: "لا توجد بيانات متاحة" | English: "No data available"
- Arabic: "جرب تعديل المرشحات أو النطاق الزمني" | English: "Try adjusting filters or time range"

---

### Loading State
**Design**:
- Skeleton loaders matching content structure
- Spinner for charts/maps
- Teal accent color
- Centered display

**Microcopy**:
- Arabic: "جاري التحميل..." | English: "Loading..."

---

### Error State
**Design**:
- Status indicator (icon + text)
- Error message (clear, actionable)
- Recovery options (retry, contact support)
- Neutral colors (no red panic)

**Microcopy**:
- Arabic: "حدث خطأ في تحميل البيانات" | English: "Error loading data"
- Arabic: "إعادة المحاولة" | English: "Retry"
- Arabic: "اتصل بالدعم" | English: "Contact Support"

---

### No Data State
**Design**:
- Icon (chart/map icon, grayed out)
- Message explaining why no data
- Suggestion to adjust filters
- Neutral, calm presentation

**Microcopy**:
- Arabic: "لا توجد بيانات للمعايير المحددة" | English: "No data for selected criteria"
- Arabic: "جرب تغيير المرشحات أو النطاق الزمني" | English: "Try changing filters or time range"

---

### Generating Report State
**Design**:
- Progress indicator (spinner or progress bar)
- Status message
- Estimated time remaining
- Cancel button (if applicable)

**Microcopy**:
- Arabic: "جاري إنشاء التقرير..." | English: "Generating report..."
- Arabic: "الوقت المتبقي: {time}" | English: "Time remaining: {time}"

---

## Accessibility

### WCAG AA Compliance
- **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI components
- **Status Communication**: Never color alone (always icon + text)
- **Keyboard Navigation**: Full keyboard support
  - Tab navigation
  - Enter/Space for actions
  - Arrow keys for charts/maps
  - Escape to close modals
- **Screen Readers**: 
  - ARIA labels on all interactive elements
  - ARIA roles (button, navigation, main, etc.)
  - ARIA live regions for dynamic content
  - Descriptive alt text for charts/maps
- **Focus Indicators**: Visible focus rings (2px teal ring)
- **Text Alternatives**: All charts have text summaries
- **Responsive Text**: Scalable up to 200% without loss of functionality

### RTL/LTR Support
- `dir="rtl"` on main container (Arabic default)
- Language toggle in header
- Bilingual labels (Arabic primary, English secondary)
- Proper text alignment (right for Arabic, left for English)
- Icon positioning (flipped for RTL where appropriate)
- Chart axis labels (right-aligned for RTL)

### Keyboard Shortcuts
- `Ctrl/Cmd + K`: Open search/filter
- `Ctrl/Cmd + E`: Export current view
- `Ctrl/Cmd + R`: Refresh data
- `Esc`: Close modals/drawers
- `Tab`: Navigate between elements
- `Enter`: Activate focused element

## Responsive Design

### Mobile (< 640px)
- **Layout**: Single column
- **Navigation**: Bottom tab bar or hamburger menu
- **Filters**: Collapsible filter drawer
- **Charts**: Simplified, scrollable
- **Maps**: Full-width, touch-friendly
- **Cards**: Full-width, stacked
- **Touch Targets**: Minimum 44px × 44px
- **Typography**: Slightly smaller (but still readable)

### Tablet (640px - 1024px)
- **Layout**: 2-column grids where appropriate
- **Navigation**: Top navigation bar
- **Filters**: Horizontal filter bar
- **Charts**: Medium-sized, interactive
- **Maps**: Full-width with controls
- **Cards**: 2-column grid
- **Touch Targets**: 44px × 44px

### Desktop (> 1024px)
- **Layout**: 3-4 column grids
- **Navigation**: Full top navigation
- **Filters**: Always visible filter bar
- **Charts**: Full-featured, large
- **Maps**: Full-featured with zoom/pan
- **Cards**: 3-4 column grid
- **Hover States**: Enabled
- **Keyboard Shortcuts**: Full support

## Color Palette

### Primary Colors
- **White**: `#FFFFFF` - Main backgrounds
- **Sand 50**: `#FAF9F6` - Secondary backgrounds
- **Sand 100**: `#F5F3ED` - Input backgrounds, subtle highlights
- **Sand 200**: `#E8E6E0` - Borders, dividers

### Accent Colors (Used Sparingly)
- **Emerald 500**: `#059669` - Primary actions, positive indicators
- **Emerald 50**: `#D1FAE5` - Subtle backgrounds, success states
- **Teal 600**: `#0F766E` - Secondary actions, links
- **Teal 50**: `#CCFBF1` - Info backgrounds

### Neutral Colors
- **Gray 50**: `#F9FAFB` - Alternate backgrounds
- **Gray 100**: `#F3F4F6` - Subtle backgrounds
- **Gray 200**: `#E5E7EB` - Borders
- **Gray 500**: `#6B7280` - Secondary text
- **Gray 700**: `#374151` - Primary text
- **Gray 900**: `#111827` - Headings

### Status Colors (Always with Icon + Text)
- **Safe/Positive**: Emerald 500 (`#059669`)
- **Neutral/Info**: Teal 600 (`#0F766E`)
- **Attention**: Amber 500 (`#F59E0B`) - Used sparingly, never for panic
- **Warning**: Amber 400 (`#FBBF24`) - Subtle warnings only

### Heatmap Colors
- **Low Value**: Sand 100 (`#F5F3ED`)
- **Medium-Low**: Emerald 100 (`#D1FAE5`)
- **Medium**: Emerald 300 (`#6EE7B7`)
- **Medium-High**: Emerald 500 (`#059669`)
- **High**: Emerald 700 (`#047857`)

## Typography

### Font Family
- **Primary**: Cairo (Arabic-first, supports both languages)
- **Fallback**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Monospace** (for data): 'Courier New', monospace

### Font Sizes
- **Heading 1**: 3xl (30px) - Page titles
- **Heading 2**: 2xl (24px) - Section titles
- **Heading 3**: xl (20px) - Subsection titles
- **Heading 4**: lg (18px) - Card titles
- **Body**: base (16px) - Main content
- **Small**: sm (14px) - Secondary text, labels
- **Extra Small**: xs (12px) - Captions, metadata

### Font Weights
- **Bold**: 700 - Headings, important metrics
- **Semi-bold**: 600 - Subheadings, emphasis
- **Medium**: 500 - Labels, buttons
- **Regular**: 400 - Body text

### Line Heights
- **Tight**: 1.2 - Headings
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Long-form content

## Spacing

### Card Padding
- **Small**: 4 (16px) - Compact cards
- **Medium**: 6 (24px) - Standard cards
- **Large**: 8 (32px) - Large cards, reports

### Gaps
- **XSmall**: 1 (4px) - Tight spacing
- **Small**: 2 (8px) - Element spacing
- **Medium**: 4 (16px) - Section spacing
- **Large**: 6 (24px) - Major section spacing
- **XLarge**: 8 (32px) - Page-level spacing

### Border Radius
- **Card**: 16px - Standard cards
- **Card Small**: 12px - Small cards
- **Button**: 12px - Buttons
- **Badge**: 20px - Status badges
- **Input**: 12px - Form inputs

## Shadows

### Shadow Types
- **Card**: `0 2px 8px rgba(0, 0, 0, 0.08)` - Standard elevation
- **Card Hover**: `0 4px 16px rgba(0, 0, 0, 0.12)` - Elevated state
- **Modal**: `0 8px 32px rgba(0, 0, 0, 0.16)` - Overlay elevation
- **Soft**: `0 1px 3px rgba(0, 0, 0, 0.06)` - Subtle elevation

## Microcopy

### Screen Titles
- **National Overview**: 
  - Arabic: "لوحة التحكم الوطنية" | English: "National Overview"
- **Heatmaps**: 
  - Arabic: "خرائط الحرارة الوطنية" | English: "National Heatmaps"
- **Trend Analysis**: 
  - Arabic: "تحليل الاتجاهات" | English: "Trend Analysis"
- **Policy Reports**: 
  - Arabic: "تقارير السياسات" | English: "Policy Reports"

### Common Actions
- **View**: Arabic: "عرض" | English: "View"
- **Download**: Arabic: "تحميل" | English: "Download"
- **Export**: Arabic: "تصدير" | English: "Export"
- **Share**: Arabic: "مشاركة" | English: "Share"
- **Filter**: Arabic: "تصفية" | English: "Filter"
- **Reset**: Arabic: "إعادة تعيين" | English: "Reset"
- **Refresh**: Arabic: "تحديث" | English: "Refresh"
- **Generate**: Arabic: "إنشاء" | English: "Generate"

### Status Messages
- **Loading**: Arabic: "جاري التحميل..." | English: "Loading..."
- **No Data**: Arabic: "لا توجد بيانات متاحة" | English: "No data available"
- **Error**: Arabic: "حدث خطأ" | English: "An error occurred"
- **Success**: Arabic: "تم بنجاح" | English: "Success"
- **Aggregated Data**: Arabic: "بيانات مجمعة" | English: "Aggregated Data"

### Filter Labels
- **Region**: Arabic: "المنطقة" | English: "Region"
- **School Type**: Arabic: "نوع المدرسة" | English: "School Type"
- **Date Range**: Arabic: "النطاق الزمني" | English: "Date Range"
- **All Regions**: Arabic: "جميع المناطق" | English: "All Regions"
- **All School Types**: Arabic: "جميع أنواع المدارس" | English: "All School Types"

### Metric Labels
- **Total Schools**: Arabic: "إجمالي المدارس" | English: "Total Schools"
- **Active Students**: Arabic: "الطلاب النشطون" | English: "Active Students"
- **Attendance Rate**: Arabic: "معدل الحضور" | English: "Attendance Rate"
- **Safety Score**: Arabic: "مؤشر السلامة" | English: "Safety Score"
- **Compliance Rate**: Arabic: "معدل الامتثال" | English: "Compliance Rate"
- **Parent Engagement**: Arabic: "مشاركة أولياء الأمور" | English: "Parent Engagement"
- **Teacher Retention**: Arabic: "استبقاء المعلمين" | English: "Teacher Retention"
- **System Health**: Arabic: "صحة النظام" | English: "System Health"

## Implementation Notes

### File Structure
```
frontend/src/
├── pages/government/
│   ├── GovernmentDashboard.tsx (Main container)
│   ├── NationalOverview.tsx
│   ├── Heatmaps.tsx
│   ├── TrendAnalysis.tsx
│   ├── PolicyReports.tsx
│   └── index.ts
└── components/government/
    ├── NationalKPICard.tsx
    ├── HeatmapMap.tsx
    ├── TrendChart.tsx
    ├── ReportCard.tsx
    ├── FilterBar.tsx
    ├── StatisticalInsightCard.tsx
    ├── RegionalDistributionMap.tsx
    ├── SchoolTypeDistribution.tsx
    └── index.ts
```

### Route
- **Path**: `/government/dashboard`
- **Roles**: `government_admin`, `authority_admin`, `super_admin`
- **Protected**: Yes (strict role-based access)

### API Integration
- Uses React Query for data fetching
- All endpoints return aggregated data only
- No PII in API responses
- Error handling with graceful degradation
- Caching for performance

### Data Privacy
- **Aggregation Level**: All data aggregated at region/school-type level
- **Minimum Group Size**: Groups with < 5 schools masked (privacy threshold)
- **No PII**: No student names, IDs, or individual identifiers
- **Audit Logging**: All data access logged
- **Data Masking**: Sensitive metrics masked if threshold not met

### Performance
- **Lazy Loading**: Charts and maps loaded on demand
- **Virtualization**: Large lists virtualized
- **Caching**: Aggregated data cached (5-15 minutes)
- **Pagination**: Large datasets paginated
- **Debouncing**: Filter inputs debounced

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live metrics
2. **Advanced Analytics**: Machine learning insights, anomaly detection
3. **Custom Dashboards**: User-configurable dashboard layouts
4. **Scheduled Reports**: Automated report generation and delivery
5. **Export Templates**: Customizable report formats
6. **Collaboration**: Share reports with annotations
7. **Predictive Analytics**: Enhanced forecasting models
8. **Mobile App**: Native mobile app for on-the-go access
9. **Offline Mode**: Cached data for offline viewing
10. **Multi-language**: Additional language support (French, etc.)

## Security & Compliance

### Access Control
- **Role-Based**: Strict role-based access control
- **Audit Trails**: All actions logged
- **Session Management**: Secure session handling
- **IP Whitelisting**: Optional IP restrictions

### Data Protection
- **Encryption**: Data encrypted in transit (TLS) and at rest
- **Data Masking**: Aggregation thresholds enforced
- **PII Detection**: Automated PII detection in exports
- **Compliance**: GDPR, UAE data protection compliance

### Export Security
- **Watermarking**: Official reports watermarked
- **Access Logging**: All exports logged
- **Format Restrictions**: Sensitive formats restricted
- **Expiration**: Time-limited download links

---

## Design Rationale

### Why This Design?

1. **Calm & Trustworthy**: Neutral colors and minimal design build trust with government stakeholders
2. **Privacy-First**: Aggregated data only ensures no privacy violations
3. **Policy-Grade**: Professional, analytical tone suitable for policy decisions
4. **Culturally Respectful**: Arabic-first, RTL support, culturally appropriate design
5. **Accessible**: WCAG AA compliance ensures inclusivity
6. **Scalable**: Design supports growth from emirate to national level
7. **Actionable**: Clear insights enable data-driven decisions
8. **Sovereign-Grade**: Professional enough for high-level government use

### Key Design Decisions

1. **No Red/Panic Colors**: Even for "negative" metrics, use neutral/amber tones
2. **Aggregation Emphasis**: Always show "Aggregated Data" badge
3. **Bilingual by Default**: Arabic primary, English secondary
4. **Chart-First**: Visual data representation prioritized
5. **Export-Ready**: All views exportable for policy documents
6. **Filter Persistence**: Filters persist across screens for continuity
7. **No Individual Identifiers**: Design enforces privacy at UI level

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Design Specification - Ready for Implementation

