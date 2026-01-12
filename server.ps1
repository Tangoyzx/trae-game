$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:3000/')
$listener.Start()
Write-Host 'Server running on http://localhost:3000'
$index = [System.IO.File]::ReadAllText('index.html')
while ($listener.IsListening) {
$context = $listener.GetContext()
$response = $context.Response
$response.ContentType = 'text/html; charset=utf-8'
$bytes = [System.Text.Encoding]::UTF8.GetBytes($index)
$response.ContentLength64 = $bytes.Length
$response.OutputStream.Write($bytes, 0, $bytes.Length)
$response.OutputStream.Close()
}