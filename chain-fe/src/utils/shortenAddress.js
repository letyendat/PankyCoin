export const shortenAddress = (address) => {
    if (address) {
        return `${address.slice(0, address.length)}`;
    }
};

export function truncate(source, size) {
    return source.length > size ? source.slice(0, size - 1) + "…" : source;
  }