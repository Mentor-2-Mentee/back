interface injectQuerysParams {
  targetBaseURL: string;
  querys: object;
}

export const injectQuerys = ({
  targetBaseURL,
  querys,
}: injectQuerysParams): string => {
  let resultURL = targetBaseURL + "?";

  for (const [index, [key, value]] of Object.entries(Object.entries(querys))) {
    if (Number(index) === Object.entries(querys).length - 1) {
      resultURL += `${key}=${value}`;
    } else {
      resultURL += `${key}=${value}&`;
    }
  }
  return resultURL;
};
