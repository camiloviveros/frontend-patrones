interface TreeNode {
  value: string | number;
  children?: TreeNode[];
}

export default function TreeVisualization({ data }: { data: TreeNode }) {
  if (!data || !data.value) return <div>No hay datos disponibles</div>;
  
  const renderNode = (node: TreeNode, level = 0, index = 0, totalNodes = 1) => {
    if (!node) return null;
    
    const hasChildren = node.children && node.children.length > 0;
    const width = 100 / Math.pow(2, level);
    const leftPosition = (index * width) + (width / 2);
    
    return (
      <div key={`${level}-${index}`} className="relative" style={{ width: `${width}%`, left: `${leftPosition}%` }}>
        <div className="absolute transform -translate-x-1/2" style={{ top: `${level * 80}px` }}>
          <div className="w-32 p-2 border-2 border-indigo-500 rounded-md bg-indigo-100 text-center">
            <span className="text-xs">{node.value}</span>
          </div>
          
          {hasChildren && (
            <div className="absolute w-px h-16 bg-indigo-400 left-1/2 transform -translate-x-1/2"></div>
          )}
        </div>
        
        {hasChildren && (
          <div className="absolute" style={{ top: `${(level + 1) * 80}px`, width: '100%' }}>
            <div className="flex">
              {node.children?.map((child, childIndex) => 
                renderNode(
                  child, 
                  level + 1, 
                  (index * node.children!.length) + childIndex, 
                  totalNodes * node.children!.length
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div>
      <p className="mb-4">Un árbol es una estructura de datos no lineal que organiza sus elementos en una jerarquía donde cada elemento tiene un nodo padre y cero o más nodos hijos.</p>
      <div className="relative h-96 mt-10 overflow-auto">
        {renderNode(data)}
      </div>
    </div>
  );
}