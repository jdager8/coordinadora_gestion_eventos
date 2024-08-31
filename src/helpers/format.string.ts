class FormatString {
  public static readonly templateString = (
    template: string,
    data: string[],
  ): string => {
    return template.replace(/\$(\d+)/g, (_, index) => data[index - 1]);
  };
}

export default FormatString;
