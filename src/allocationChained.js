import { generateRandomColor } from "./allocationContiguous";

export const addFileChained = (
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
) => {
  if (!Array.isArray(allocatedFiles)) {
    console.error("Erro: allocatedFiles não é um array.", allocatedFiles);
    return { success: false, message: "Erro interno: lista de arquivos inválida." };
  }

  if (fileSize <= 0) {
    return { success: false, message: "O tamanho do arquivo deve ser maior que zero." };
  }

  if (allocatedFiles.some((file) => file.name === fileName)) {
    return { success: false, message: `O arquivo "${fileName}" já está alocado.` };
  }

  const freeNodes = nodes.filter((node) => node.data.label === "Livre");

  if (freeNodes.length < fileSize) {
    return { success: false, message: "Espaço insuficiente no disco." };
  }

  const allocatedBlocks = [];
  const updatedNodes = [...nodes];
  const newEdges = [...edges];

  const fileColor =
    fileColors[fileName] || generateRandomColor(Object.values(fileColors));

  setFileColors({ ...fileColors, [fileName]: fileColor });

  for (let i = 0; i < fileSize; i++) {
    const randomIndex = Math.floor(Math.random() * freeNodes.length);
    const block = freeNodes.splice(randomIndex, 1)[0];

    allocatedBlocks.push(block.id);
    updatedNodes[block.id - 1] = {
      ...block,
      data: { label: `${fileName} (${i + 1}/${fileSize})` },
      style: { backgroundColor: fileColor },
    };

    if (i > 0) {
      newEdges.push({
        id: `e${allocatedBlocks[i - 1]}-${block.id}`,
        source: allocatedBlocks[i - 1],
        target: block.id,
        type: "smoothstep", 
        animated: false, 
        style: { stroke: fileColor, strokeWidth: 3 }, 
        markerEnd: {
          type: "arrowclosed",
          width: 10,
          height: 10,
          color: fileColor, 
        },
      });
    }
  }

  setNodes(updatedNodes);
  setEdges(newEdges);

  setAllocatedFiles([
    ...allocatedFiles,
    { name: fileName, blocks: allocatedBlocks },
  ]);

  return { success: true, message: `Arquivo "${fileName}" alocado com sucesso.` };
};

export const deleteFileChained = (
  nodes,
  edges,
  fileName,
  setNodes,
  setEdges,
  allocatedFiles,
  setAllocatedFiles
) => {
  const fileEntry = allocatedFiles.find((file) => file.name === fileName);

  if (!fileEntry) {
    return `Arquivo "${fileName}" não encontrado.`;
  }

  const { blocks } = fileEntry;
  const updatedNodes = [...nodes];
  const updatedEdges = edges.filter(
    (edge) => !blocks.includes(edge.source) && !blocks.includes(edge.target)
  );

  blocks.forEach((blockId) => {
    const nodeIndex = updatedNodes.findIndex((node) => node.id === blockId);
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        data: { label: "Livre" },
        style: { backgroundColor: "#ffffff", border: "1px solid #ccc" },
      };
    }
  });

  const remainingFiles = allocatedFiles.filter((file) => file.name !== fileName);
  setAllocatedFiles(remainingFiles);
  setNodes(updatedNodes);
  setEdges(updatedEdges);

  return `Arquivo "${fileName}" desalocado com sucesso.`;
};
