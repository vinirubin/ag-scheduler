# Algoritmo Genético para Geração de Grade de Horários Escolar

Este repositório implementa um **Algoritmo Genético (AG)** com o objetivo de gerar uma grade de horários para uma instituição de ensino, otimizando a alocação de aulas, professores, turmas e demais recursos, de forma a atender as restrições e maximizar a eficiência do uso dos espaços e tempos disponíveis.

---

## Sumário

- [Introdução](#introdução)
- [Entendendo o Problema](#entendendo-o-problema)
- [Estrutura do Projeto](#estrutura-do-projeto)
  - [Arquivos Principais](#arquivos-principais)
  - [Diretórios Importantes](#diretórios-importantes)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Metodologias Utilizadas no AG](#metodologias-utilizadas-no-ag)
- [Considerações Finais](#considerações-finais)

---

## Introdução

A criação de uma grade de horários escolar é um problema de escalonamento que envolve diversas variáveis e restrições. Este projeto utiliza um Algoritmo Genético para simular processos evolutivos e encontrar soluções viáveis e otimizadas para a distribuição de aulas, respeitando as demandas de professores, turmas e recursos.

---

## Entendendo o Problema

O desafio principal é combinar de forma eficiente as diversas variáveis (aulas, professores, turmas, períodos e recursos) dentro de um conjunto limitado de horários e espaços, garantindo que as restrições institucionais e operacionais sejam respeitadas.

---

## Estrutura do Projeto

A seguir, detalha-se a estrutura de arquivos e o papel de cada componente:

### Arquivos Principais

- **index.js**  
  Responsável por iniciar a execução do Algoritmo Genético.

- **package.json** e **package-lock.json**  
  Arquivos de configuração do Node.js, definindo as dependências e scripts necessários para o funcionamento do projeto.

### Diretórios Importantes

#### Diretório `models/`

Contém as implementações das classes fundamentais do AG:

- **AlgoritmoGenetico.js**  
  Implementa a lógica central do algoritmo, gerenciando a evolução da população de soluções.

- **Atividade.js**  
  Define a estrutura e as propriedades das atividades que compõem as aulas.

- **Aula.js**  
  Modela as aulas, considerando suas características e restrições específicas.

- **DiaDaSemana.js**  
  Gerencia a representação dos dias da semana na grade de horários.

- **Individuo.js**  
  Representa uma solução individual no contexto do AG, contendo os dados referentes à alocação de aulas e recursos.

- **Periodo.js**  
  Define os períodos disponíveis para a alocação das aulas.

- **PeriodoSemanal.js**  
  Organiza os períodos de tempo distribuídos ao longo da semana.

- **Professor.js**  
  Modela os professores, incluindo suas disponibilidades e qualificações.

- **Recurso.js**  
  Define os recursos (salas, equipamentos, etc.) necessários para a realização das atividades.

- **Turma.js**  
  Representa as turmas, ligando as aulas e os professores de forma coerente.

- **Turno.js**  
  Modela os turnos (manhã, tarde, noite) disponíveis para a organização das aulas.

#### Diretório `input/`

- **dados.js**  
  Arquivo que contém os dados de entrada essenciais para o funcionamento do AG, como informações sobre professores, turmas, aulas e recursos.

#### Diretório `output/`

- Pasta destinada ao salvamento do arquivo HTML que apresenta a melhor solução encontrada pelo AG, permitindo uma visualização clara e intuitiva da grade de horários gerada.

---

## Como Executar o Projeto

Para executar o projeto, é necessário ter o Node.js e o npm instalados. Siga os passos abaixo:

1. **Instalar as dependências:**  
   Execute no terminal:
   ```bash
   npm install
   ```

2. **Iniciar a aplicação:**  
   Execute no terminal:
   ```bash
   npm start
   ``` 

O projeto será iniciado e, ao final do processo, o melhor resultado obtido será salvo na pasta output/ em formato HTML.

## Metodologias Utilizadas no AG

O algoritmo implementa diversas metodologias e técnicas para simular o processo evolutivo:

### 1. Representação do Indivíduo

Cada **Indivíduo** representa uma possível solução para a grade de horários. A codificação dos indivíduos foi desenvolvida para facilitar as operações de cruzamento e mutação.

### 2. Seleção por Torneio

A **seleção por torneio** é utilizada para escolher os indivíduos que participarão da reprodução. Neste método, grupos de indivíduos competem, e os melhores são selecionados para gerar a próxima geração.

### 3. Cruzamento

O **cruzamento** combina as informações de dois indivíduos, gerando novos indivíduos que podem herdar as melhores características dos pais, contribuindo para a melhoria das soluções.

### 4. Mutação

A **mutação** introduz variações aleatórias nos indivíduos. Essa etapa é crucial para explorar novas soluções e evitar que o algoritmo fique preso em ótimos locais.

### 5. Processo de Evolução

O processo de **evolução** envolve múltiplas iterações, onde os indivíduos são avaliados e aprimorados através das operações de seleção, cruzamento e mutação até que se atinja um critério de parada (como número máximo de gerações ou solução satisfatória).

### 6. Apresentação dos Dados

Ao final do processo evolutivo, a melhor solução encontrada é gerada em um arquivo HTML, facilitando a análise e interpretação da grade de horários.

### 7. Parâmetros Utilizados

Os parâmetros do AG – como tamanho da população, taxa de mutação, taxa de cruzamento e número de gerações – estão definidos no código e podem ser ajustados para otimização dos resultados, conforme as necessidades específicas do problema.

## Considerações Finais

Este projeto demonstra a aplicabilidade dos Algoritmos Genéticos em problemas de escalonamento, especialmente na geração de grades de horários escolares. A modularidade do código e a clareza na definição das etapas do AG possibilitam futuras adaptações e melhorias, além de servir como base para estudos e implementações em contextos similares.
