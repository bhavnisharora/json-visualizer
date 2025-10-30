import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';

const SAMPLE_JSON = {
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001"
    },
    "isActive": true
  },
  "orders": [
    {
      "orderId": "ORD-001",
      "total": 299.99,
      "items": ["Laptop", "Mouse"]
    },
    {
      "orderId": "ORD-002",
      "total": 49.99,
      "items": ["Keyboard"]
    }
  ],
  "settings": {
    "notifications": true,
    "theme": "dark"
  }
};


// Custom Node Component

const CustomNode = ({ data }) => {
  const getNodeStyle = () => {
    const baseStyle = "px-4 py-2 rounded-lg shadow-md border-2 min-w-[120px] text-center transition-all";
    
    if (data.isHighlighted) {
      return `${baseStyle} bg-yellow-300 border-yellow-500 animate-pulse`;
    }
    
    switch (data.type) {
      case 'object':
        return `${baseStyle} bg-purple-100 border-purple-400 hover:bg-purple-200`;
      case 'array':
        return `${baseStyle} bg-green-100 border-green-400 hover:bg-green-200`;
      case 'primitive':
        return `${baseStyle} bg-orange-100 border-orange-400 hover:bg-orange-200`;
      default:
        return `${baseStyle} bg-gray-100 border-gray-400`;
    }
  };

  return (
    <div className={getNodeStyle()} title={data.tooltip}>
      <div className="font-semibold text-sm text-gray-800">{data.label}</div>
      {data.value !== undefined && (
        <div className="text-xs text-gray-600 mt-1 wrap-break-word max-w-[200px]">
          {String(data.value)}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// JSON Input Component
const JsonInput = ({ onVisualize }) => {
  const [jsonText, setJsonText] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [error, setError] = useState('');

  const handleVisualize = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setError('');
      onVisualize(parsed);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">JSON Input</h2>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-500"
        placeholder="Paste your JSON here..."
      />
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-300 rounded-lg flex items-start gap-2">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}
      <button
        onClick={handleVisualize}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Generate Tree
      </button>
    </div>
  );
};


// Search Component
const SearchBar = ({ onSearch, searchResult }) => {
  const [searchPath, setSearchPath] = useState('');

  const handleSearch = () => {
    onSearch(searchPath);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchPath}
            onChange={(e) => setSearchPath(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by path (e.g., $.user.address.city or orders[0].total)"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Search
        </button>
      </div>
      {searchResult && (
        <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
          searchResult.found ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'
        }`}>
          {searchResult.found ? (
            <>
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-green-700 text-sm font-medium">Match found!</span>
            </>
          ) : (
            <>
              <AlertCircle className="text-red-500" size={20} />
              <span className="text-red-700 text-sm font-medium">No match found</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Tree Visualizer Component
const TreeVisualizer = ({ nodes, edges, onNodesChange, onEdgesChange, fitView }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#ddd" gap={16} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.data.isHighlighted) return '#fcd34d';
            switch (node.data.type) {
              case 'object': return '#c4b5fd';
              case 'array': return '#86efac';
              case 'primitive': return '#fed7aa';
              default: return '#e5e7eb';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
};




const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchResult, setSearchResult] = useState(null);

  const generateTree = useCallback((data) => {
    const newNodes = [];
    const newEdges = [];
    let nodeId = 0;
    const levelWidth = 250;
    const levelHeight = 150;

    const getNodeCountAtLevel = (obj, level = 0, counts = {}) => {
      counts[level] = (counts[level] || 0) + 1;
      
      if (typeof obj === 'object' && obj !== null) {
        const items = Array.isArray(obj) ? obj : Object.entries(obj);
        items.forEach(item => {
          const value = Array.isArray(obj) ? item : item[1];
          getNodeCountAtLevel(value, level + 1, counts);
        });
      }
      
      return counts;
    };

    const levelCounts = getNodeCountAtLevel(data);
    const levelOffsets = {};

    const traverse = (obj, parentId = null, key = 'root', path = '$', level = 0) => {
      const id = `node-${nodeId++}`;
      
      if (!levelOffsets[level]) {
        levelOffsets[level] = 0;
      }
      
      const totalAtLevel = levelCounts[level] || 1;
      const startX = -(totalAtLevel - 1) * levelWidth / 2;
      const x = startX + levelOffsets[level] * levelWidth;
      const y = level * levelHeight;
      
      levelOffsets[level]++;

      let nodeType = 'primitive';
      let label = key;
      let value = obj;
      let tooltip = `Path: ${path}`;

      if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
          nodeType = 'array';
          label = `${key} []`;
          value = undefined;
          tooltip += `\nType: Array\nLength: ${obj.length}`;
        } else {
          nodeType = 'object';
          label = `${key} {}`;
          value = undefined;
          tooltip += `\nType: Object\nKeys: ${Object.keys(obj).length}`;
        }
      } else {
        tooltip += `\nValue: ${JSON.stringify(obj)}`;
      }

      newNodes.push({
        id,
        type: 'custom',
        position: { x, y },
        data: { 
          label, 
          value, 
          type: nodeType, 
          path,
          tooltip,
          isHighlighted: false
        },
      });

      if (parentId) {
        newEdges.push({
          id: `edge-${parentId}-${id}`,
          source: parentId,
          target: id,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
        });
      }

      if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            traverse(item, id, `[${index}]`, `${path}[${index}]`, level + 1);
          });
        } else {
          Object.entries(obj).forEach(([key, val]) => {
            traverse(val, id, key, `${path}.${key}`, level + 1);
          });
        }
      }
    };

    traverse(data);
    setNodes(newNodes);
    setEdges(newEdges);
    setSearchResult(null);
  }, [setNodes, setEdges]);

  const handleSearch = useCallback((searchPath) => {
    if (!searchPath.trim()) {
      setSearchResult({ found: false });
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, isHighlighted: false },
        }))
      );
      return;
    }

    const normalizedPath = searchPath.startsWith('$') ? searchPath : `$.${searchPath}`;
    
    const matchedNode = nodes.find(node => node.data.path === normalizedPath);

    if (matchedNode) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isHighlighted: node.id === matchedNode.id,
          },
        }))
      );
      setSearchResult({ found: true });
      
      // Center the matched node
      setTimeout(() => {
        const flowElement = document.querySelector('.react-flow');
        if (flowElement) {
          const rect = flowElement.getBoundingClientRect();
          const nodeElement = document.querySelector(`[data-id="${matchedNode.id}"]`);
          if (nodeElement) {
            nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
    } else {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, isHighlighted: false },
        }))
      );
      setSearchResult({ found: false });
    }
  }, [nodes, setNodes]);

  useEffect(() => {
    generateTree(SAMPLE_JSON);
  }, [generateTree]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">JSON Tree Visualizer</h1>
          <p className="text-gray-600">Visualize and explore JSON data structures</p>
        </header>

        <JsonInput onVisualize={generateTree} />
        <SearchBar onSearch={handleSearch} searchResult={searchResult} />
        <TreeVisualizer 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
        
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Legend</h3>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-200 border-2 border-purple-400 rounded"></div>
              <span className="text-sm text-gray-700">Object</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border-2 border-green-400 rounded"></div>
              <span className="text-sm text-gray-700">Array</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-200 border-2 border-orange-400 rounded"></div>
              <span className="text-sm text-gray-700">Primitive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-300 border-2 border-yellow-500 rounded"></div>
              <span className="text-sm text-gray-700">Highlighted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;