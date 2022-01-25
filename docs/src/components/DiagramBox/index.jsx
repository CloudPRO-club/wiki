import * as React from 'react'
import { Mermaid } from './mermaidConfiguration'

export function DiagramBox ({children}) {
  if (typeof children !== 'string') {
    throw Error('component "DiagramBox" have only type string for children!')
    return null
  }
  return <Mermaid diagram={children} />
}
