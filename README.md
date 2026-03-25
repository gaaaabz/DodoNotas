# 📱 DodoNotas

##  Descrição do projeto

O DodoNotas é um aplicativo mobile desenvolvido com React Native que permite ao usuário criar, visualizar e gerenciar notas de forma simples e prática.

Os dados das notas são armazenados em tempo real utilizando o Firebase Firestore, garantindo persistência e sincronização eficiente.

O app possui funcionalidades como:

* Criar notas
* Listar notas
* Visualizar detalhes de uma nota
* Armazenamento em nuvem com Firebase

---

## Tecnologias utilizadas

* React Native
* Expo
* TypeScript
* Firebase (Firestore)
* JavaScript

---

##  Como rodar o projeto

### 1. Pré-requisitos

Antes de começar, você precisa ter instalado:

* Node.js
* npm ou yarn
* Expo CLI

```bash
npm install -g expo-cli
```

---

### 2. Instalar dependências

```bash
npm install
```

---

### 3. Configurar o Firebase

No arquivo:

```
src/services/firebaseConfig.tsx
```

Adicione suas credenciais do Firebase (caso ainda não estejam configuradas).

---

### 4. Rodar o projeto

```bash
npm start
```

Depois disso:

* Use o app **Expo Go** no celular para escanear o QR Code
  ou
* Rode em um emulador Android/iOS

---

## Persistência de dados (Firestore)

O projeto utiliza o **Firebase Firestore** para:

* Armazenar notas
* Recuperar dados em tempo real
* Garantir persistência na nuvem

Arquivo responsável:

```
src/services/userDataService.ts
```

---

## 📂 Estrutura básica do projeto

```
app/
 ├── Home.tsx
 ├── CadastrarScreen.tsx
 ├── nota/[id].tsx
 ├── components/
 │    └── NotasLista.js

src/
 └── services/
      ├── firebaseConfig.tsx
      └── userDataService.ts
```

---

## Projeto feito por: 

* Julia Damasceno Busso - RM560293 - 2TDSPB
* Gabriel Gomes Cardoso - Rm559597 - 2TDSPB
* Jhonatan Quispe Torrez - rm560601 - 2TDSPB
