import React from 'react';
import MyControl, { ControlProps } from './MyControl'

export interface AutoFocusControlProps extends ControlProps {
  autofocus?: boolean
}

export default abstract class MyAutoFocusControl<P> extends MyControl<P & AutoFocusControlProps> {
  protected innerRef: any;

  constructor(props: any) {
    super(props);
    this.innerRef = React.createRef();
  }

  public componentDidMount() {
    const { autofocus } = this.props;

    if (autofocus)
      setTimeout(() => this.innerRef.current.focus(), 1);
  }
}
