declare namespace JSX {
  interface Element {
    tag: string | Function;
    props: Record<string, any>;
  }

  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
