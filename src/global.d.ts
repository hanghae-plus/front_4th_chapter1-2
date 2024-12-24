declare namespace JSX {
  interface Element {
    type: string | Function;
    props: Record<string, any>;
    children?: JSX.Element[];
  }

  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
