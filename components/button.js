import styles from './button.module.css';

export default function Button({ children, className = styles.button, ...rest }) {
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}
