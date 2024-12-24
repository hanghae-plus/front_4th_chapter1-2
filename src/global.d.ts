declare namespace JSX {
  interface Element {
    type: string | Function;
    props: Record<string, any>;
    children?: any[];
  }

  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
