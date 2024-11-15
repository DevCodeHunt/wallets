import styles from "./Input.module.css";

const Input = ({
  id,
  label,
  name,
  placeholder,
  type = "text",
  icon: Icon,
  error,
  value,
  onChange,
  ...rest
}) => {
  return (
    <div className={styles.input}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputBox}>
        {Icon && (
          <span className={styles.icon}>
            <Icon size={20} />
          </span>
        )}
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          {...rest}
        />
      </div>
      {error && <small>{error}</small>}
    </div>
  );
};

export default Input;
