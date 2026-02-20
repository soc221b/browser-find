export type Next = {
  type: "Next";

  value: {
    id: number;

    ranges: Range[];
  };
};
