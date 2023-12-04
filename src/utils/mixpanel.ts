import mixpanel from "mixpanel-browser";

// Initialize Mixpanel
mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '', { debug: true });
console.log("Mixpanel initialized", process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);

// Generic type for event handlers
type GenericEventHandler<E extends React.SyntheticEvent> = (event: E) => void;
type AdditionalProps = { [key: string]: any };

// Define the withTracking higher-order function with generic types
export const withTracking = <E extends React.SyntheticEvent>(
    handler: GenericEventHandler<E> | null, 
    eventName: string = "Button Clicked", 
    additionalProps: AdditionalProps = {}
): GenericEventHandler<E> => {
    return (event: E) => {
        // Track the event with Mixpanel
        mixpanel.track(eventName, {
            ...additionalProps,
            // Include more contextual information here if needed
        });

        // Call the original event handler if it exists
        if (handler) handler(event);
    };
};

// Export mixpanel as default and withTracking separately
export default mixpanel;
