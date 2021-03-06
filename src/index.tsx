import React from "react";
import classNames from "classnames";

type Props = {
  src: string;
  loadingClassName?: string;
  loadedClassName?: string;
  options?: IntersectionObserverInit;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const hasIntersectionObserver = Boolean(window.IntersectionObserver);

const isIntersecting = (callback: () => void) => (
  entries: IntersectionObserverEntry[]
) => {
  entries.filter(e => e.isIntersecting).forEach(callback);
};

export class LazyImage extends React.Component<Props> {
  state = {
    loaded: false,
    src: this.props.src
  };

  private observer: IntersectionObserver | null = null;
  elmRef = React.createRef<HTMLImageElement>();

  onLoad = () => {
    this.setState(() => ({ loaded: true }));
  };

  startLoading(imageElement: HTMLImageElement) {
    imageElement.setAttribute("src", this.state.src);
  }

  resolveObserving = () => {
    const imageElement = this.elmRef.current;

    if (!imageElement) {
      return;
    }

    if (hasIntersectionObserver) {
      this.addObserver(imageElement);
    } else {
      this.startLoading(imageElement);
    }
  };

  addObserver(imageElement: HTMLImageElement) {
    this.observer = new IntersectionObserver(
      isIntersecting(() => {
        this.startLoading(imageElement);
        if (this.observer) {
          this.observer.disconnect();
        }
      }),
      this.props.options
    );

    this.observer.observe(imageElement);
  }

  componentDidMount() {
    this.resolveObserving();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.src !== this.props.src) {
      this.setState(
        {
          src: this.props.src
        },
        this.resolveObserving
      );
    }
  }

  render() {
    const {
      className,
      loadedClassName,
      loadingClassName,
      src,
      ...imgProps
    } = this.props;

    const imageClasses = classNames(
      className,
      this.state.loaded && loadedClassName,
      !this.state.loaded && loadingClassName
    );

    return (
      <img
        {...imgProps}
        className={imageClasses}
        onLoad={this.onLoad}
        ref={this.elmRef}
        alt="cover"
        data-testid="lazy-image"
      />
    );
  }
}
