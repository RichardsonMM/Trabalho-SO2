import { generateRandomColor } from "./allocationContiguous";

export const addFileIndexed = (
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
  }

  const indexBlock = allocatedBlocks[0];

  allocatedBlocks.slice(1).forEach((blockId) => {
    newEdges.push({
      id: `e${indexBlock}-${blockId}`,
      source: `${indexBlock}`,
      target: `${blockId}`,
      type: "smoothstep",
      animated: false,
      style: { stroke: fileColor, strokeWidth: 3 },
      markerEnd: { type: "arrowclosed", color: fileColor },
    });
  });

  setNodes(updatedNodes);
  setEdges(newEdges);

  setAllocatedFiles([
    ...allocatedFiles,
    { name: fileName, indexBlock, blocks: allocatedBlocks },
  ]);

  return { success: true, message: `Arquivo "${fileName}" alocado com sucesso.` };
};

export const deleteFileIndexed = (
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

  const { indexBlock, blocks } = fileEntry;
  const updatedNodes = [...nodes];
  const updatedEdges = edges.filter(
    (edge) =>
      edge.source !== `${indexBlock}` && !blocks.includes(edge.target)
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
