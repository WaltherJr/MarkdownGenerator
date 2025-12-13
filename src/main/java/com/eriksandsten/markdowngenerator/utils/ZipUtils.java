package com.eriksandsten.markdowngenerator.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public final class ZipUtils {
    public static void unzip(String zipFilePath, String destDir) throws IOException {
        File dir = new File(destDir);
        if (!dir.exists()) dir.mkdirs();

        byte[] buffer = new byte[1024];

        try (ZipInputStream zis =
                     new ZipInputStream(new FileInputStream(zipFilePath))) {

            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                File newFile = new File(destDir, entry.getName());

                // Security check (Zip Slip protection)
                String canonicalPath = newFile.getCanonicalPath();
                if (!canonicalPath.startsWith(dir.getCanonicalPath() + File.separator)) {
                    throw new IOException("Entry is outside target dir: " + entry.getName());
                }

                if (entry.isDirectory()) {
                    newFile.mkdirs();
                } else {
                    new File(newFile.getParent()).mkdirs();
                    try (FileOutputStream fos = new FileOutputStream(newFile)) {
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }
                }
                zis.closeEntry();
            }
        }
    }
}
