# FileTStation

A TypeScript wrapper for interacting with Synology's FileStation. I was going to
use this in a project so that I could use an old NAS as my personal file bucket,
but unfortunately FileStation has a file link sharing limit which prevents me
from getting images. Use at your own risk!

## Usage

- Create an env file and add a variable called "FS_API_URL", and set it to your
  public NAS IP
- Create an instance of the FileStationCredentials class to refresh the credentials
- Use the FileStation class to interact with your NAS
