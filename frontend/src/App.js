import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import NodeModal from './components/NodeModal';

const API_URL = 'http://localhost:5000/api';

const nodeTypes = {
  coldEmail: ColdEmailNode,
  wait: WaitNode,
  leadSource: LeadSourceNode,
};

// Custom Nodes
function ColdEmailNode({ data }) {
  return (
    <div className="custom-node cold-email-node">
      <h3>Cold Email</h3>
      <div className="node-content">
        <p><strong>Subject:</strong> {data.subject || 'Click to edit'}</p>
        <p><strong>Body:</strong> {data.body || 'Click to edit'}</p>
      </div>
    </div>
  );
}

function WaitNode({ data }) {
  return (
    <div className="custom-node wait-node">
      <h3>Wait</h3>
      <div className="node-content">
        <p><strong>Duration:</strong> {data.duration || '1'} hours</p>
      </div>
    </div>
  );
}

function LeadSourceNode({ data }) {
  return (
    <div className="custom-node lead-source-node">
      <h3>Lead Source</h3>
      <div className="node-content">
        <p><strong>Type:</strong> {data.type || 'Manual Input'}</p>
      </div>
    </div>
  );
}

// Sidebar component
function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <div className="description">Drag nodes to the canvas</div>
      <div 
        className="dndnode cold-email" 
        onDragStart={(e) => onDragStart(e, 'coldEmail')} 
        draggable
      >
        Cold Email
      </div>
      <div 
        className="dndnode wait" 
        onDragStart={(e) => onDragStart(e, 'wait')} 
        draggable
      >
        Wait
      </div>
      <div 
        className="dndnode lead-source" 
        onDragStart={(e) => onDragStart(e, 'leadSource')} 
        draggable
      >
        Lead Source
      </div>
    </aside>
  );
}

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { 
      id: '1', 
      type: 'input', 
      data: { label: 'Start' }, 
      position: { x: 250, y: 25 },
      style: {
        background: '#fff',
        border: '1px solid #777',
        borderRadius: '5px',
        padding: '10px'
      }
    }
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [sequenceName, setSequenceName] = useState('Untitled Sequence');

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - event.target.getBoundingClientRect().left - 50,
        y: event.clientY - event.target.getBoundingClientRect().top - 25,
      };

      const newNode = {
        id: String(Date.now()),
        type,
        position,
        data: { label: type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    if (node.type !== 'input') {
      setSelectedNode(node);
    }
  }, []);

  const onModalClose = () => {
    setSelectedNode(null);
  };

  const onModalSave = (formData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...formData,
            },
          };
        }
        return node;
      })
    );
  };

  const onSave = useCallback(() => {
    const flow = { nodes, edges };
    localStorage.setItem('emailFlow', JSON.stringify(flow));
    alert('Flow saved successfully!');
  }, [nodes, edges]);

  const onRestore = useCallback(() => {
    const flow = JSON.parse(localStorage.getItem('emailFlow'));
    if (flow) {
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    }
  }, [setNodes, setEdges]);

  const onPublish = useCallback(async () => {
    try {
      setIsPublishing(true);
      const response = await fetch(`${API_URL}/sequence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sequenceName,
          nodes,
          edges,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish sequence');
      }

      const result = await response.json();
      alert('Sequence published successfully!');
      console.log('Published sequence:', result);
    } catch (error) {
      console.error('Error publishing sequence:', error);
      alert('Failed to publish sequence. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  }, [nodes, edges, sequenceName]);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          <Panel position="top-right">
            <div className="button-container">
              <input
                type="text"
                value={sequenceName}
                onChange={(e) => setSequenceName(e.target.value)}
                className="sequence-name-input"
                placeholder="Sequence Name"
              />
              <button onClick={onSave} className="flow-button">
                Save Flow
              </button>
              <button onClick={onRestore} className="flow-button">
                Restore Flow
              </button>
              <button 
                onClick={onPublish} 
                className={`flow-button publish ${isPublishing ? 'publishing' : ''}`}
                disabled={isPublishing}
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
      {selectedNode && (
        <NodeModal
          node={selectedNode}
          onClose={onModalClose}
          onSave={onModalSave}
        />
      )}
    </div>
  );
}

export default App; 