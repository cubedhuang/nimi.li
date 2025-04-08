export class Persisted<T> {
	#key = $state<string>('');
	#value = $state<T>();

	constructor(key: string, initial: T, validate?: (value: T) => boolean) {
		key = `nimi.li:${key}`;

		this.#key = key;
		this.#value = initial;

		if (typeof localStorage !== 'undefined') {
			const json = localStorage.getItem(key);

			if (json !== null) {
				let parsed: T | null;

				try {
					parsed = JSON.parse(json);
				} catch {
					parsed = null;
				}

				if (parsed !== null && (!validate || validate(parsed))) {
					this.#value = parsed;
				}
			}
		}
	}

	get value() {
		return this.#value as T;
	}

	set value(value) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(this.#key, JSON.stringify(value));
		}

		this.#value = value;
	}
}
