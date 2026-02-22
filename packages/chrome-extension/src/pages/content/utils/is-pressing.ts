export const isPressing = ({
  event,
  code,
  altKey,
  ctrlKey,
  metaKey,
  shiftKey,
}: {
  event: KeyboardEvent;
  code: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}) => {
  return (
    event.code === code &&
    event.altKey === !!altKey &&
    event.ctrlKey === !!ctrlKey &&
    event.metaKey === !!metaKey &&
    event.shiftKey === !!shiftKey
  );
};
