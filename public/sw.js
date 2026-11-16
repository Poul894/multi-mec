self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'Multi Mec', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Multi Mec';
  const options = {
    body: data.body || '',
    icon: '/icon-512.png',
    badge: '/icon-192.png',
    data: { url: data.url || '/admin' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/admin';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
