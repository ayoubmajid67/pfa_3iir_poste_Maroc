from rest_framework.throttling import SimpleRateThrottle

# custom throttle class to limit the number of requests from non-authenticated users to 3 every 30 minutes
class CustomAnonRateThrottle(SimpleRateThrottle):
    scope = 'custom_anon'

    def parse_rate(self, rate):
        if rate is None:
            return None, None

        num_requests, duration = rate.split('/')
        num_requests = int(num_requests)

        # Custom duration parsing
        if duration == '30m':
            duration_seconds = 30 * 60
        else:
            try:
                duration_seconds = {
                    's': 1,
                    'm': 60,
                    'h': 3600,
                    'd': 86400
                }[duration[-1]] * int(duration[:-1])
            except KeyError:
                raise ValueError(f"Invalid rate duration format: {duration}")

        return num_requests, duration_seconds

    def get_cache_key(self, request, view):
        # Use the user's IP address as the unique key
        if request.user.is_authenticated:
            # If the user is authenticated, we won't throttle them with this throttle class
            return None

        # Get the IP address of the client
        ip_address = self.get_ident(request)

        return self.cache_format % {
            'scope': self.scope,
            'ident': ip_address
        }

