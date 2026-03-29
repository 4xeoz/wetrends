# Component Library Documentation

This document provides an overview of the reusable wrapper components and patterns used throughout the WeTrends application.

## Architecture Overview

Our component architecture follows these principles:
- **Composition over inheritance**
- **Separation of concerns**
- **Reusable and configurable components**
- **Consistent error handling and loading states**
- **TypeScript-first development**

## Component Categories

### 1. Authentication Wrappers (`/app/_component/auth/`)

#### AuthGate
The main authentication wrapper that handles route protection and user redirection.

**Use Cases:**
- Protecting admin routes
- Redirecting authenticated users from public pages
- Providing consistent auth state management

**Example:**
```tsx
// Protect a dashboard route
<AuthGate requireAuth={true} redirectTo="/login">
  <AdminDashboard />
</AuthGate>

// Public route that redirects authenticated users
<AuthGate requireAuth={false}>
  <LoginForm />
</AuthGate>
```

#### ProtectedRoute
Higher-order component for routes requiring authentication.

```tsx
<ProtectedRoute>
  <UserProfile />
</ProtectedRoute>
```

#### PublicRoute
Component for public routes with optional authenticated user redirection.

```tsx
<PublicRoute redirectTo="/dashboard">
  <SignUpForm />
</PublicRoute>
```

### 2. Layout Wrappers (`/app/_component/shared/wrapper.tsx`)

#### Wrapper
Flexible polymorphic container with configurable width and padding.

**Props:**
- `as`: HTML element type (div, section, main, etc.)
- `maxWidth`: Responsive width constraints
- `padding`: Spacing presets
- `className`: Additional styles

**Example:**
```tsx
<Wrapper as="section" maxWidth="lg" padding="md">
  <Content />
</Wrapper>
```

#### PageWrapper
Pre-configured wrapper for full page layouts.

```tsx
<PageWrapper>
  <Header />
  <MainContent />
  <Footer />
</PageWrapper>
```

#### SectionWrapper
Semantic wrapper for page sections.

```tsx
<SectionWrapper>
  <h2>Section Title</h2>
  <SectionContent />
</SectionWrapper>
```

### 3. Error Handling (`/app/_component/shared/error-boundary.tsx`)

#### ErrorBoundary
React error boundary with recovery functionality.

**Features:**
- Catches JavaScript errors in child components
- Provides fallback UI
- Error logging for debugging
- Reset functionality for recovery

**Example:**
```tsx
<ErrorBoundary fallback={CustomErrorComponent}>
  <RiskyComponent />
</ErrorBoundary>
```

### 4. Loading States (`/app/_component/shared/loading-wrapper.tsx`)

#### LoadingWrapper
Suspense wrapper with customizable loading states.

```tsx
<LoadingWrapper fallback={<CustomSpinner />}>
  <AsyncComponent />
</LoadingWrapper>
```

#### SpinnerLoader
Simple animated spinner for inline loading.

```tsx
<SpinnerLoader size={16} className="text-blue-500" />
```

#### PageLoader
Full page loading component.

```tsx
{isLoading ? <PageLoader /> : <PageContent />}
```

## Hooks

### useAsync
Custom hook for managing async operations state.

**Features:**
- Loading state management
- Error handling
- Manual execution control
- Optimistic updates

**Example:**
```tsx
const { data, loading, error, execute, setData } = useAsync(
  () => fetchUserData(userId),
  true // Execute immediately
)

// Optimistic update
const handleDelete = (id) => {
  setData(data.filter(item => item.id !== id))
  deleteItem(id)
}
```

## Best Practices

### 1. Component Composition
```tsx
// ✅ Good - Compose smaller components
<ErrorBoundary>
  <LoadingWrapper>
    <ProtectedRoute>
      <PageWrapper>
        <Dashboard />
      </PageWrapper>
    </ProtectedRoute>
  </LoadingWrapper>
</ErrorBoundary>

// ❌ Avoid - Large monolithic components
<MegaComponent requireAuth loading error dashboard />
```

### 2. Error Handling
```tsx
// ✅ Good - Wrap potential error sources
<ErrorBoundary fallback={ErrorFallback}>
  <DataFetchingComponent />
</ErrorBoundary>

// ❌ Avoid - Unhandled errors
<DataFetchingComponent /> // Could crash the app
```

### 3. Loading States
```tsx
// ✅ Good - Provide loading feedback
<LoadingWrapper fallback={<Skeleton />}>
  <AsyncContent />
</LoadingWrapper>

// ❌ Avoid - No loading indication
<AsyncContent /> // Users see nothing while loading
```

### 4. TypeScript Usage
```tsx
// ✅ Good - Proper typing
interface ComponentProps {
  data: User[]
  onSelect: (user: User) => void
}

// ❌ Avoid - Any types
interface ComponentProps {
  data: any
  onSelect: any
}
```

## Common Patterns

### Page Layout Pattern
```tsx
function MyPage() {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <PageWrapper>
          <h1>Page Title</h1>
          <LoadingWrapper>
            <PageContent />
          </LoadingWrapper>
        </PageWrapper>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
```

### Data Fetching Pattern
```tsx
function DataComponent() {
  const { data, loading, error, execute } = useAsync(() => fetchData())
  
  if (error) return <ErrorMessage error={error} retry={execute} />
  if (loading) return <SpinnerLoader />
  
  return <DataDisplay data={data} />
}
```

### Form Handling Pattern
```tsx
function FormComponent() {
  const { execute: submitForm, loading } = useAsync(
    () => submitData(formData),
    false // Don't execute immediately
  )
  
  return (
    <form onSubmit={submitForm}>
      {/* form fields */}
      <Button disabled={loading}>
        {loading ? <SpinnerLoader size={16} /> : 'Submit'}
      </Button>
    </form>
  )
}
```

## Migration Guide (Junior → Senior)

### Before (Junior Pattern)
```tsx
function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{/* dashboard content */}</div>
}
```

### After (Senior Pattern)
```tsx
function Dashboard() {
  const { data, loading, error } = useAsync(() => fetchData())
  
  if (error) return <ErrorMessage error={error} />
  
  return (
    <LoadingWrapper fallback={<DashboardSkeleton />}>
      <ErrorBoundary>
        <DashboardContent data={data} />
      </ErrorBoundary>
    </LoadingWrapper>
  )
}
```

## Performance Considerations

1. **Memoization**: Use `React.memo` for expensive renders
2. **Code Splitting**: Lazy load components with `React.lazy`
3. **Error Boundaries**: Prevent entire app crashes
4. **Loading States**: Provide immediate user feedback
5. **Optimistic Updates**: Update UI before server confirmation

## Testing Strategies

1. **Unit Tests**: Test individual components
2. **Integration Tests**: Test component composition
3. **Error Tests**: Test error boundary scenarios
4. **Loading Tests**: Test loading states and transitions
5. **Accessibility Tests**: Ensure WCAG compliance
```
