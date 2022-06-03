// ApplicationValidators -----------------------------------------------------

// Application-specific validators that can be used in both client and server
// environments.  In all cases, a "true" return indicates that the proposed
// value is valid, while "false" means it is not.  If a field is required, that
// must be validated separately.

// Public Objects -----------------------------------------------------------

export const validateGroupScope = (scope: string | undefined): boolean => {
    if (!scope || (scope.length === 0)) {
        return true;
    }
    return scope.match(GROUP_SCOPE_PATTERN) !== null;
}

export const validateUuid = (uuid: string): boolean => {
    if (uuid) {
        return UUID_PATTERN.test(uuid);
    } else {
        return true;
    }
}

// Private Objects -----------------------------------------------------------

export const GROUP_SCOPE_PATTERN: RegExp = /^[a-zA-Z0-9]+$/;
export const UUID_PATTERN: RegExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
