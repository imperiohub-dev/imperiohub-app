# Componentes de Jerarquía

Sistema de componentes para manejar la jerarquía de objetivos sin recursión profunda.

## Arquitectura

La jerarquía sigue este orden:
```
Visión → Meta → Objetivo → Misión → Tarea
```

### Navegación por Niveles

En lugar de recursión infinita, cada nivel tiene su propia vista de detalle:

- **VisionsList**: Muestra visiones, preview de metas (colapsable)
- **MetaDetailView**: Vista completa de una meta + lista de objetivos
- **ObjetivoDetailView**: Vista completa de un objetivo + lista de misiones
- **MisionDetailView**: Vista completa de una misión + lista de tareas

## Componentes Principales

### HierarchyCard

Componente principal para mostrar un item con preview de sus hijos inmediatos.

```tsx
<HierarchyCard
  item={vision}
  icon={Target}
  iconColor="#3B82F6"

  // Configuración de hijos
  childrenKey="metas"
  childrenLabel="Metas"
  createButtonLabel="+ Nueva Meta"
  childIcon={Flag}
  childIconColor="#F59E0B"

  // Callbacks
  onToggleDone={(id, isDone) => {}}
  onCreateChild={(parentId) => {}}
  onChildPress={(child) => navegarAMeta(child)}

  level={0}
/>
```

**Props clave:**
- `childIcon` y `childIconColor`: Para renderizar los hijos en preview
- `onChildPress`: Callback para navegar cuando se hace click en un hijo
- Ya **NO** usa `renderChild` (recursión eliminada)

### HierarchyPreview

Componente compacto para mostrar items sin expansión.

```tsx
<HierarchyPreview
  item={tarea}
  icon={CheckSquare}
  iconColor="#10B981"
  onPress={(item) => {}}
/>
```

Usado para:
- Mostrar hijos dentro de HierarchyCard expandido
- Mostrar tareas en MisionDetailView (nivel final)

## Vistas de Detalle

### MetaDetailView

```tsx
<MetaDetailView
  meta={metaSeleccionada}
  onBack={() => volverAVisiones()}
  onToggleDone={(id, isDone) => {}}
  onCreateObjetivo={(metaId) => {}}
  onObjetivoPress={(objetivo) => navegarAObjetivo(objetivo)}
/>
```

### ObjetivoDetailView

```tsx
<ObjetivoDetailView
  objetivo={objetivoSeleccionado}
  onBack={() => volverAMeta()}
  onToggleDone={(id, isDone) => {}}
  onCreateMision={(objetivoId) => {}}
  onMisionPress={(mision) => navegarAMision(mision)}
/>
```

### MisionDetailView

```tsx
<MisionDetailView
  mision={misionSeleccionada}
  onBack={() => volverAObjetivo()}
  onToggleDone={(id, isDone) => {}}
  onCreateTarea={(misionId) => {}}
  onTareaPress={(tarea) => {}}
/>
```

## Ejemplo de Flujo de Navegación

```tsx
function App() {
  const [currentView, setCurrentView] = useState<'vision' | 'meta' | 'objetivo' | 'mision'>('vision');
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [selectedMision, setSelectedMision] = useState(null);

  // Vista Visiones
  if (currentView === 'vision') {
    return (
      <VisionsList
        visiones={visiones}
        onCreateVision={handleCreateVision}
        onToggleDone={handleToggleDone}
        onCreateMeta={handleCreateMeta}
        onMetaPress={(meta) => {
          setSelectedMeta(meta);
          setCurrentView('meta');
        }}
      />
    );
  }

  // Vista Meta
  if (currentView === 'meta' && selectedMeta) {
    return (
      <MetaDetailView
        meta={selectedMeta}
        onBack={() => setCurrentView('vision')}
        onToggleDone={handleToggleDone}
        onCreateObjetivo={handleCreateObjetivo}
        onObjetivoPress={(objetivo) => {
          setSelectedObjetivo(objetivo);
          setCurrentView('objetivo');
        }}
      />
    );
  }

  // Vista Objetivo
  if (currentView === 'objetivo' && selectedObjetivo) {
    return (
      <ObjetivoDetailView
        objetivo={selectedObjetivo}
        onBack={() => setCurrentView('meta')}
        onToggleDone={handleToggleDone}
        onCreateMision={handleCreateMision}
        onMisionPress={(mision) => {
          setSelectedMision(mision);
          setCurrentView('mision');
        }}
      />
    );
  }

  // Vista Misión
  if (currentView === 'mision' && selectedMision) {
    return (
      <MisionDetailView
        mision={selectedMision}
        onBack={() => setCurrentView('objetivo')}
        onToggleDone={handleToggleDone}
        onCreateTarea={handleCreateTarea}
      />
    );
  }
}
```

## Beneficios

✅ **UI más limpia**: Solo muestra 1 nivel de profundidad a la vez
✅ **Mejor rendimiento**: No renderiza toda la jerarquía recursivamente
✅ **Navegación clara**: Cada nivel tiene su propia pantalla dedicada
✅ **Más mantenible**: Cada vista es independiente y fácil de modificar
✅ **Mejor UX móvil**: Evita el scroll infinito y la complejidad visual

## Hooks

### useHierarchyCard

Hook que encapsula la lógica de HierarchyCard.

```tsx
const {
  isExpanded,
  childrenItems,
  canHaveChildren,
  indentation,
  handleHeaderPress,
  handleToggleDone,
  handleCreateChild,
} = useHierarchyCard({
  item,
  childrenKey,
  defaultExpanded,
  level,
  onToggleDone,
  onCreateChild,
  onItemPress,
});
```

## Constantes

Usa `HIERARCHY_CONFIG` de `@/constants/hierarchy` para obtener configuración de cada nivel:

```tsx
const metaConfig = HIERARCHY_CONFIG.meta;

// Resultado:
{
  icon: Flag,
  iconColor: "#F59E0B",
  childrenKey: "objetivos",
  childrenLabel: "Objetivos",
  createButtonLabel: "+ Nuevo Objetivo",
  singularName: "Meta",
  pluralName: "Metas",
  parentKey: "visionId",
}
```
