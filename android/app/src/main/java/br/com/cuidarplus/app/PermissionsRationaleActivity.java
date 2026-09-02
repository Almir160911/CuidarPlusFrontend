package br.com.cuidarplus.app;

import android.os.Bundle;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

public class PermissionsRationaleActivity
    extends AppCompatActivity
{
    @Override
    protected void onCreate(
        Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        new AlertDialog.Builder(this)
            .setTitle(
                "Privacidade dos dados de saúde")
            .setMessage(
                "O CuidarPlus acessa somente os dados de saúde autorizados por você para acompanhar sinais vitais, atividade e sono. Os dados são enviados de forma autenticada para a pessoa e o dispositivo selecionados.")
            .setPositiveButton(
                "Entendi",
                (dialog, which) -> finish())
            .setOnCancelListener(
                dialog -> finish())
            .show();
    }
}
