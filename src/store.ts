import * as React from 'react';

export abstract class StoreComponent<Props, State, StoreState> extends React.Component<Props, State> {
    public stores: StoreState = {} as StoreState;
    private isStoreMounted: boolean = false;

    abstract storeComponentDidMount(): void;

    abstract storeComponentWillUnmount(): void;

    constructor(stores: StoreState) {
        super();

        this.stores = stores;

        for (let storeObject in this.stores) {
            if (this.stores.hasOwnProperty(storeObject)) {
                let store: any = this.stores[storeObject];
                store.components.push(this);
            }
        }
    }

    componentDidMount() {
        this.isStoreMounted = true;
        this.storeComponentDidMount();
    }

    componentWillUnmount() {
        this.isStoreMounted = false;
        this.storeComponentWillUnmount();
    }
}

export class Store<StoreState> {
    public components = [];
    public state: StoreState = null;

    constructor(state: StoreState) {
        this.state = state;
    }

    public setState(newState: StoreState): void {
        let updated: boolean = false;

        for (let property in newState) {
            if (newState.hasOwnProperty(property) && this.state.hasOwnProperty(property)) {
                if (this.state[property] !== newState[property]) {
                    this.state[property] = newState[property];
                    updated = true;
                }
            }
        }

        if (updated) {
            this.update();
        }
    }

    private update(): void {
        this.components.forEach((component) => {
            if (component.isStoreMounted) {
                component.forceUpdate();
            }
        });
    }
}