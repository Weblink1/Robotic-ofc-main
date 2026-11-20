async function checkSSR() {
  const res = await fetch('http://localhost:3000');
  const text = await res.text();
  console.log('HTML length:', text.length);
  console.log('Includes open-booking:', text.includes('open-booking'));
  console.log('Includes booking-modal:', text.includes('booking-modal'));
  console.log('Includes Robotic Performance Booking Desk:', text.includes('Performance Booking Desk') || text.includes('Performance Inquiries Desk'));
}
checkSSR().catch(console.error);
