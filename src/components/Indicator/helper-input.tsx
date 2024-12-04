type Props = {
  renderif: boolean;
  message: string;
};

export default function HelperInput({ renderif, message }: Props) {
  return (
    renderif && (
      <span className="capitalize text-red-500 p-0.5 text-sm">{message}</span>
    )
  );
}
