
# **Simulador de Formas de Alocação de Blocos Lógicos**

Este é um simulador de métodos de alocação de blocos lógicos, implementado como uma aplicação web interativa. Ele suporta os métodos de alocação:

- **Contígua**
- **Encadeada**
- **Indexada**

O simulador permite criar e manipular blocos lógicos no disco, adicionando arquivos, deletando-os e visualizando suas alocações de forma gráfica.

---

## **Pré-requisitos**

Antes de rodar o projeto, certifique-se de ter o seguinte instalado no sistema:

1. **Node.js** (versão LTS recomendada - 18 ou superior).
   - Você pode baixar o Node.js em: [https://nodejs.org/](https://nodejs.org/)
2. **Gerenciador de Pacotes npm** (vem junto com o Node.js).
3. **Editor de Texto ou IDE** (recomendado: VS Code).

---

## **Passo a Passo para Rodar o Projeto**

### 1. **Clone o Repositório**
Faça o download do código-fonte para a sua máquina. Você pode clonar o repositório usando o Git:

```bash
git clone <URL_DO_REPOSITORIO>
```

### 2. **Instale as Dependências**
Instale todas as dependências do projeto listadas no `package.json`:

```bash
npm install
```

Este comando instalará bibliotecas essenciais como:

- **React**
- **React Flow**
- **React Toastify**

---

### 4. **Inicie o Servidor de Desenvolvimento**
Para iniciar o simulador no navegador, execute o seguinte comando:

```bash
npm start
```

Após isso, o projeto será compilado e aberto automaticamente no navegador padrão. Se isso não ocorrer, acesse:

```
http://localhost:3000
```

---

## **Como Usar o Simulador**

1. **Escolha o Método de Alocação:**
   - Use o menu suspenso para selecionar entre os métodos **Contígua**, **Encadeada** ou **Indexada**.

2. **Defina o Tamanho do Disco:**
   - Insira o número de blocos que o disco deve ter no campo "Tamanho do Disco".
   - Clique em **Criar Disco** para inicializar os blocos lógicos.

3. **Adicione Arquivos:**
   - Preencha os campos:
     - **Nome do Arquivo**
     - **Tamanho do Arquivo (em blocos lógicos)**
   - Clique em **Adicionar Arquivo**. O arquivo será alocado de acordo com o método selecionado.

4. **Deletar Arquivos:**
   - Insira o nome do arquivo no campo de deleção e clique em **Deletar Arquivo**.

5. **Visualizar Alocação:**
   - Clique em um arquivo na tabela para destacar sua alocação no disco.

---

## **Estrutura do Projeto**

- **`src/`**:
  - **`App.js`**: Arquivo principal da aplicação.
  - **`allocationContiguous.js`**: Lógica para alocação contígua.
  - **`allocationChained.js`**: Lógica para alocação encadeada.
  - **`allocationIndexed.js`**: Lógica para alocação indexada.
  - **`App.css`**: Estilos CSS da aplicação.

---

## **Tecnologias Utilizadas**

- **React.js**: Framework principal para criação da interface.
- **React Flow**: Para visualização gráfica dos blocos e arestas.
- **React Toastify**: Para exibição de notificações (sucesso/erro).
- **HTML5 + CSS3**: Estrutura e estilização.

---
