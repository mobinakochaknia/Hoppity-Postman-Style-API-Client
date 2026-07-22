import { ThemeProvider } from '@/context/ThemeContext';
import { TabsProvider } from '@/context/TabsContext';
import { HistoryProvider } from '@/context/HistoryContext';
import { CollectionsProvider } from '@/context/CollectionsContext';
import { ErrorBoundary } from '@/components/UI/ErrorBoundary';
import { Home } from '@/pages/Home';

/** Root component: wires up global providers and the error boundary. */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CollectionsProvider>
          <HistoryProvider>
            <TabsProvider>
              <Home />
            </TabsProvider>
          </HistoryProvider>
        </CollectionsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
