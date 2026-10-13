import { Component, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  onFail: () => void
}

type State = {
  failed: boolean
}

export class StadiumBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onFail()
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}
