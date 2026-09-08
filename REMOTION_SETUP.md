# Remotion Video Project Setup

## ✅ Instalação Completa

Todas as dependências do Remotion foram instaladas com sucesso:

### Dependências Principais
- **remotion** (v4.0.522) - Framework principal para renderização de vídeos com React
- **@remotion/gif** (v4.0.522) - Suporte para GIFs animados
- **@remotion/transitions** (v4.0.522) - Efeitos de transição entre sequências
- **react** (v19.2.8) - Biblioteca React
- **react-dom** (v19.2.8) - React DOM

### Dependências de Desenvolvimento
- **typescript** - Suporte a TypeScript
- **@types/react**, **@types/react-dom**, **@types/node** - Tipos TypeScript

## 📁 Estrutura do Projeto

```
src/
├── Root.tsx              # Configuração principal com Composition
├── HelloWorld.tsx        # Componente exemplo básico
├── Transitions.tsx       # Exemplo com transições (@remotion/transitions)
└── GifExample.tsx        # Exemplo com GIFs (@remotion/gif)
public/                   # Pasta para assets (imagens, áudio, vídeos)
remotion.config.ts        # Configuração do Remotion
tsconfig.json             # Configuração do TypeScript
package.json              # Dependências e scripts
```

## 🚀 Comandos Disponíveis

```bash
# Iniciar preview no navegador (porta 3000)
npm run dev

# Renderizar todos os vídeos
npm run build

# Renderizar composição específica para arquivo MP4
npm run render
```

## 📝 Criando Novos Vídeos

### 1. Adicionar Composição no Root.tsx
```tsx
<Composition
  id="MeuVideo"
  component={MeuComponente}
  durationInFrames={300}  // 10 segundos em 30fps
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{}}
/>
```

### 2. Usar Componentes
- **React Components**: Escreva componentes React normais
- **useVideoConfig()**: Acesse dimensões e configurações do vídeo
- **Sequence**: Defina duração e posição no timeline
- **Img**: Inclua imagens
- **staticFile()**: Referencie arquivos na pasta `public/`

### 3. Aplicar Transições
```tsx
import { slide } from '@remotion/transitions';

<Sequence
  from={0}
  durationInFrames={75}
  {...slide({ direction: 'from-left' })}
>
  {/* Conteúdo */}
</Sequence>
```

### 4. Usar GIFs
```tsx
import { Img } from 'remotion';

<Img 
  src="https://exemplo.com/arquivo.gif"
  style={{ width: 400, height: 300 }}
/>
```

## ⚙️ Configuração Remotion

O arquivo `remotion.config.ts` está configurado com:
- **Codec**: h264 (compatível com a maioria dos reprodutores)
- **Pixel Format**: yuv420p (padrão para vídeos)
- **Preview Port**: 3000
- **Concurrency**: 4 (velocidade de renderização)

## 📚 Recursos Úteis

- [Documentação Remotion](https://www.remotion.dev)
- [Referência de Transições](https://www.remotion.dev/docs/transitions)
- [Guia de GIFs](https://www.remotion.dev/docs/gif)

## 🎬 Próximos Passos

1. Execute `npm run dev` para abrir o preview
2. Edite `src/HelloWorld.tsx` para customizar
3. Adicione seus componentes na pasta `src/`
4. Use `npm run render` para gerar o vídeo final

Bom filme! 🎥
