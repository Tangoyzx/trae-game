$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()
Write-Host 'Server running on http://localhost:8000'

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    # 获取请求的文件路径
    $filePath = $request.Url.LocalPath
    
    # 默认请求根路径时返回index.html
    if ($filePath -eq '/') {
        $filePath = '/index.html'
    }
    
    # 构建本地文件路径
    $localPath = Join-Path -Path (Get-Location) -ChildPath ($filePath.TrimStart('/'))
    
    # 设置内容类型
    $contentType = 'text/plain'
    if ($filePath -match '\.html$') {
        $contentType = 'text/html; charset=utf-8'
    } elseif ($filePath -match '\.js$') {
        $contentType = 'application/javascript; charset=utf-8'
    } elseif ($filePath -match '\.css$') {
        $contentType = 'text/css; charset=utf-8'
    }
    
    try {
        # 读取文件内容
        $bytes = [System.IO.File]::ReadAllBytes($localPath)
        $response.ContentType = $contentType
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } catch {
        # 文件不存在时返回404
        $response.StatusCode = 404
        $response.ContentType = 'text/plain'
        $errorMsg = 'File not found: ' + $filePath
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($errorMsg)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    
    $response.OutputStream.Close()
}