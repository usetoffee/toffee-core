export const parseEthError = (error: any) => {
  let message = error?.data?.message || error?.error?.message || error.message;
  let safeMessage;
  safeMessage = message.replace(/execution reverted: (.*)/, "$1");
  safeMessage = message.replace(
    /VM Exception while processing transaction: revert (.*)/,
    "$1"
  );
  return safeMessage;
};
