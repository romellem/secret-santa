const applicationState = {
  page: "setup"
};

export function getApplicationState() {
  return applicationState;
}

export function replaceApplicationState(nextState) {
  Object.keys(applicationState).forEach((key) => {
    delete applicationState[key];
  });
  Object.assign(applicationState, nextState);
}

export function updateApplicationState(partialState) {
  Object.assign(applicationState, partialState);
}
