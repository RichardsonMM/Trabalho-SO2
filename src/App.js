import React, { useState } from "react";
import ReactFlow, { Background } from "reactflow";
import { toast, ToastContainer } from "react-toastify";
import ReactTooltip from "react-tooltip";

import "reactflow/dist/style.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import {
  generateRandomColor,
  addFileContiguous,
  deleteFileContiguous,
} from "./allocationContiguous";
import {
  addFileChained,
  deleteFileChained,
  generateEdges,
} from "./allocationChained";

import {
  addFileIndexed,
  deleteFileIndexed,
} from "./allocationIndexed";

const App = () => {
  const [numBlocks, setNumBlocks] = useState(0); 
  const [allocationType, setAllocationType] = useState("Contígua"); 
  const [nodes, setNodes] = useState([]); 
  const [edges, setEdges] = useState([]); 
  const [fileName, setFileName] = useState(""); 
  const [fileSize, setFileSize] = useState(0); 
  const [fileColors, setFileColors] = useState({}); 
  const [allocatedFiles, setAllocatedFiles] = useState([]); 
  const [selectedFile, setSelectedFile] = useState(null); 

  const clearSelection = () => {
    setSelectedFile(null);
  };

  const handleCreateDisk = () => {
    const spacing = 80; 
    const gridSize = Math.ceil(Math.sqrt(numBlocks)); 
    const newNodes = Array.from({ length: numBlocks }, (_, index) => ({
      id: `${index + 1}`,
      type: "default",
      position: {
        x: (index % gridSize) * spacing,
        y: Math.floor(index / gridSize) * spacing,
      },
      data: { label: "Livre" }, 
      style: { backgroundColor: "#ffffff", border: "1px solid #ccc" }, 
    }));
  
    setNodes(newNodes);
    setEdges([]);
    setAllocatedFiles([]); 
    setFileColors({}); 
    setSelectedFile(null); 
  };
  


  const handleAddFile = () => {
    if (!Array.isArray(allocatedFiles)) {
      console.error("Erro: allocatedFiles não é um array.", allocatedFiles);
      return;
    }

    let result;

    if (allocationType === "Contígua") {
      result = addFileContiguous(
        nodes,
        fileName,
        fileSize,
        setNodes,
        fileColors,
        setFileColors,
        setAllocatedFiles,
        allocatedFiles
      );
    } else if (allocationType === "Encadeada") {
      result = addFileChained(
        nodes,
        edges,
        fileName,
        fileSize,
        setNodes,
        setEdges,
        fileColors,
        setFileColors,
        setAllocatedFiles,
        allocatedFiles
      );
    }
   else if (allocationType === "Indexada") {
    result = addFileIndexed(
      nodes,
      edges,
      fileName,
      fileSize,
      setNodes,
      setEdges,
      fileColors,
      setFileColors,
      setAllocatedFiles,
      allocatedFiles
    );
  }

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }

    setFileName("");
    setFileSize(0);
  };

  const handleDeleteFile = (fileName) => {
    const fileToDelete = allocatedFiles.find((file) => file.name === fileName);
  
    if (!fileToDelete) {
      toast.error(`Arquivo "${fileName}" não encontrado.`);
      return;
    }
  
    if (allocationType === "Contígua") {
      const message = deleteFileContiguous(
        nodes,
        fileToDelete.name,
        fileToDelete.startBlock,
        fileToDelete.length,
        setNodes,
        allocatedFiles,
        setAllocatedFiles
      );
      toast.success(message);
    } else if (allocationType === "Encadeada") {
      const message = deleteFileChained(
        nodes,
        edges,
        fileToDelete.name,
        setNodes,
        setEdges,
        allocatedFiles,
        setAllocatedFiles
      );
      toast.success(message);
    } else if (allocationType === "Indexada") {
      const message = deleteFileIndexed(
        nodes,
        edges,
        fileToDelete.name,
        setNodes,
        setEdges,
        allocatedFiles,
        setAllocatedFiles
      );
      toast.success(message);
    }
  
    setFileName("");
  };
  

  const handleSelectFile = (file) => {
    if (
      allocationType === "Encadeada" &&
      file &&
      Array.isArray(file.blocks)
    ) {
      setSelectedFile(file);
    } else if (allocationType === "Contígua" && file) {
      setSelectedFile(file);
      
    }
    else if(
      allocationType === "Indexada" &&
      file &&
      Array.isArray(file.blocks)
    )
    {setSelectedFile(file);} 
    
    else {
      console.warn("Arquivo inválido selecionado:", file);
      setSelectedFile(null);
    }
  };
  


  const updatedNodes = nodes.map((node) => {
    if (selectedFile) {
      if (allocationType === "Contígua") {
        const startBlock = selectedFile.startBlock;
        const endBlock = startBlock + selectedFile.length - 1;
        const blockIndex = parseInt(node.id, 10);
  
        if (blockIndex >= startBlock && blockIndex <= endBlock) {
          return {
            ...node,
            style: {
              ...node.style,
              border: "2px solid #CCC", 
              opacity: 1,
            },
          };
        }
      } else if (
        allocationType === "Encadeada" &&
        Array.isArray(selectedFile.blocks) &&
        selectedFile.blocks.includes(node.id)
      ) {
        return {
          ...node,
          style: {
            ...node.style,
            border: "2px solid #CCC", 
            opacity: 1,
          },
        };
      }
      else if (
        allocationType === "Indexada" &&
        Array.isArray(selectedFile.blocks) &&
        selectedFile.blocks.includes(node.id)
      ) {
        return {
          ...node,
          style: {
            ...node.style,
            border: "2px solid #CCC", 
            opacity: 1,
          },
        };
      }
    }
  
    return {
      ...node,
      style: {
        ...node.style,
        opacity: selectedFile ? 0.3 : 1, 
      },
    };
  });
  

  
  const updatedEdges = edges.map((edge) => {
    if (allocationType === "Encadeada" || allocationType === "Indexada") {
      if (
        selectedFile &&
        Array.isArray(selectedFile.blocks) &&
        selectedFile.blocks.includes(edge.source) &&
        selectedFile.blocks.includes(edge.target)
      ) {
        
        return {
          ...edge,
          style: {
            ...edge.style,
            // stroke: "#CCC", // Cor destacada
            strokeWidth: 4,
            // opacity: 1,
          },
        };
      }

      return {
        ...edge,
        style: {
          ...edge.style,
          opacity: selectedFile ? 0.3 : 1, // Apagado ou normal
        },
      };
    }

    return edge;
  });
  
  
  


  return (

<div className="app" onClick={clearSelection}>
  <h1>Simulador de Formas de Alocação de Blocos Lógicos</h1>

   {/* Pergunta sobre o Método de Alocação */}
   <div className="allocation-method-container">
    <label htmlFor="allocation-method" className="allocation-label">
      Método de Alocação:
    </label>
    <select
      id="allocation-method"
      value={allocationType}
      onChange={(e) => setAllocationType(e.target.value)}
      className="allocation-select"
    >
      <option value="Contígua">Contígua</option>
      <option value="Encadeada">Encadeada</option>
      <option value="Indexada">Indexada</option>
    </select>
  </div>

  {/* Configurações do Disco */}
  <div className="input-container">
  <label htmlFor="disk-size" className="disk-size-label">
     Tamanho do Disco:
    </label>
    <input
      type="number"
      placeholder="Enter number of blocks"
      value={numBlocks}
      onChange={(e) => setNumBlocks(Number(e.target.value))}
    />
    {/* <select
      value={allocationType}
      onChange={(e) => setAllocationType(e.target.value)}
    >
      <option value="Contígua">Contígua</option>
      <option value="Encadeada">Encadeada</option>
      <option value="Indexada">Indexada</option>
    </select> */}
    <button onClick={handleCreateDisk}>Criar Disco</button>
  </div>

  {/* Adicionar Arquivo */}
  <div className="file-input-container">
    <input
      type="text"
      placeholder="Nome do arquivo"
      value={fileName}
      onChange={(e) => setFileName(e.target.value)}
    />
    <input
      type="number"
      placeholder="Tamanho do arquivo (blocos)"
      value={fileSize}
      onChange={(e) => setFileSize(Number(e.target.value))}
    />
    <button onClick={handleAddFile}>Adicionar Arquivo</button>
  </div>


  {/* Deletar Arquivo por Nome */}
  <div className="delete-file-container">
  <input
    type="text"
    placeholder="Digite o nome do arquivo para deletar"
    value={fileName}
    onChange={(e) => setFileName(e.target.value)}
  />
  <button
    onClick={() => handleDeleteFile(fileName)}

    
      >
        Deletar Arquivo
      </button>
    </div>
    <div className="main-container">


    {/* Disco */}
    <div className="flow-container">
      <ReactFlow nodes={updatedNodes} edges={updatedEdges} fitView>
        <Background variant="dots" gap={16} size={1} />
      </ReactFlow>
    </div>

  


    {/* Tabela de Arquivos */}
    <div
      className="file-table-container"
      onClick={(e) => e.stopPropagation()} // Impede que clique aqui limpe a seleção
    >
      <h3>Arquivos Alocados ({allocationType})</h3>
      <table>
      <thead>
      <tr>
        <th>File Name</th>
        {allocationType === "Indexada" ? (
          <th>Index Block</th>
        ) : (
          <>
            <th>Start Block</th>
            <th>Length</th>
          </>
        )}
        {/* <th>Ação</th> */}
      </tr>
    </thead>

    <tbody>
      {allocatedFiles.map((file, index) => (
        <tr
          key={index}
          onClick={() => handleSelectFile(file)}
          style={{
            cursor: "pointer",
            backgroundColor:
              selectedFile && selectedFile.name === file.name
                ? "#e0e0e0"
                : "transparent",
          }}
        >
          <td>{file.name}</td>
          {allocationType === "Indexada" ? (
            <td>{file.indexBlock || "-"}</td>
          ) : (
            <>
              <td>{file.startBlock || file.blocks?.[0] || "-"}</td>
              <td>{file.length || file.blocks?.length || "-"}</td>
            </>
          )}
          {/* <td>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(file.name);
              }}
              style={{
                padding: "5px 10px",
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Deletar
            </button>
          </td> */}
        </tr>
      ))}
    </tbody>

      </table>
    </div>
  </div>

  {/* Toast Container */}
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
  />
</div>

  );
};

export default App;
